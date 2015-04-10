var fs   = require('fs'),
    sys  = require('sys'),
    exec = require('child_process').exec;

/* GET home page. */

var TIME_LIMIT =  1 * 1000 * 60,
    MAX_BUFFER = 500 * 1024;

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
        response.msg += 'You can\'t call system functions';
        res.send(response.msg);
        return;
      }
      if(response.err) return;

      var ucode = './codes/' + req.user.code,
          file = ucode + '.cu';
      try {
        fs.writeFileSync(file,source);
      } catch (e) {
        response.err = true;
        response.msg += e;
      }
      if(response.err){
        res.send(response.msg);
        return;
      }

      var comp = 'nvcc ' + file + ' -arch=compute_35 -o ' + ucode;
      var child = exec(comp, {timeout: TIME_LIMIT}, function (error, stdout, stderr) {
        if (error) {
          console.log('compile error');
          console.log(error);
          response.err = true;
          response.msg += "Compile Error\nError code: "+error.code+"\nSignal received run: "+error.signal+"\nError: "+ stderr;
          //res.send(response.msg);
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
      });

      child.on('close', function(code, signal){
        var child2 = exec(ucode, {timeout: TIME_LIMIT, killSignal: "SIGKILL"}, function (error, stdout, stderr) {
          if (error) {
            console.log('run error');
            response.err = true;
            response.msg += "Run time error\nError code: "+error.code+"\nSignal received run: "+error.signal;
            //res.send(response.msg);
            fs.unlink(ucode, function (err){
              if(err)
                console.log('error removing executable');
            });
            return;
          }
          // agregar child2.onKillSignal
          if(stderr.lenght > 0)
            response.msg += '\n-------------------------\n' + stderr + '\n-------------------------\n';
          response.msg += stdout;
          //res.send(response.msg);
          fs.unlink(ucode, function (err){
            if(err)
              console.log('error removing executable');
          });
        });
        child2.on('close', function(code, signal){
          console.log(code);
          console.log(signal);
          console.log(response);
          if(signal === 'SIGKILL')
            response.msg = 'Your program takes more than 1 minute to end or never ends.\nSignal: SIGTERM'
          res.send(response.msg);
        });
      });

    });

  });
}
