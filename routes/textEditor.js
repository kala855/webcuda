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
      var source = req.body.source;
      if( source.search(/.*system\(.*/) != -1) {
        var response = {err : true, msg};
        response.err = true;
        response.msg = 'No esta permitido hacer llamados al sistema';
        res.json(response);
        return;
      }
      var code = './code/' + req.user.code,
          file = code + '.cu';
      fs.writeFileSync(file,source, function(err){
        var response = {};
        if(err){
          console.log(err);
          response.err=true;
          response.msg='Error al guardar el archivo';
          res.json(response);
          return;
        }
      });
      var comp = 'nvcc' + code + '.cu -o ' + code;

      var child = execSync(comp, ,function (error, stdout, stderr) {
        if (error) {
          console.log('compile error');
          console.log(error);
          res.send("Compile Error\nError code: "+error.code+"\nSignal received run: "+error.signal+"\nError: "+ stderr);
          return;
        }
        if(stderr) {
          console.log('Compile STDERR1: '+stderr);
          res.send(stderr);
          return;
        }
      });

      console.log('Compile STDOUT1: '+stdout);
      var child2 = execSync(code, { timeout: 1000, killSignal: 'SIGKILL'}, function (error, stdout, stderr) {
        if (error) {
          console.log('run error');
          console.log(error.stack);
          res.send("Run time error\nError code: "+error.code+"\nSignal received run: "+error.signal);
          return;
        }
        // agregar child2.onKillSignal
        console.log('Run STDERR: '+stderr);
        if(stderr.lenght > 0)
          res.send(stderr + '\n-------------------------\n' + stdout);
      });

    });

  });
}
