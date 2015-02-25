var fs   = require('fs'),
    sys  = require('sys'),
    exec = require('child_process').exec;

/* GET home page. */

module.exports = function(app,passport){
  app.namespace('/compiler',function(){
    app.get('/textEditor', function(req, res) {
      // TMP mientras se prueba
      if(req.isAuthenticated()){
        res.render('textEditor/textEditor', {user : req.user, title: 'Editor'});
      }else
        res.render('users/signin');
    });


    app.post('/compileAndRun', function(req, res) {
      var response = {};
      response.msg = "";
      var source = req.body.source;
      if( source.search(/.*system\(.*/) != -1) {
        response.err = true;
        response.msg = 'You can\'t call system functions';
        res.json(response);
        return;
      }
      if(response.err) return;

      var code = './codes/' + req.user.code,
          file = code + '.cc';
      try {
        fs.writeFileSync(file,source);
      } catch (e) {
        response.err = true;
        response.msg = e;
      }
      if(response.err){
        res.send(response.msg);
        return;
      }

      var comp = 'g++ ' + file + ' -Wall -O2 -o ' + code;
      var child = exec(comp, function (error, stdout, stderr) {
        if (error) {
          console.log('compile error');
          console.log(error);
          response.err = true;
          response.msg = "Compile Error\nError code: "+error.code+"\nSignal received run: "+error.signal+"\nError: "+ stderr;
          res.json(response);
          return;
        }
        if(stderr) {
          console.log('Compile STDERR1: '+stderr);
          response.err = false;
          response.msg += '\n--------warnings---------\n' + stderr + '\n-------------------------\n';
          console.log(stderr);
          //res.json(response);
        }
        fs.unlink(file, function (err){
          if(err)
            console.log('error removing executable');
        });

        var child2 = exec(code, { timeout: 1000 * 60 * 2, killSignal: 'SIGKILL'}, function (error, stdout, stderr) {
          if (error) {
            console.log('run error');
            response.err = true;
            response.msg = "Run time error\nError code: "+error.code+"\nSignal received run: "+error.signal;
            res.send(response.msg);
            fs.unlink(code, function (err){
              if(err)
                console.log('error removing executable');
            });
            return;
          }
          // agregar child2.onKillSignal
          if(stderr.lenght > 0)
            response.msg += '\n-------------------------\n' + stderr + '\n-------------------------\n';
          response.msg += stdout;
          res.send(response.msg);
          fs.unlink(code, function (err){
            if(err)
              console.log('error removing executable');
          });
        });
      });


    });

  });
}
