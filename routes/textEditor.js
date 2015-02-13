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
      if( source.search(/.*system\(.*/) != -1){
        var response = {};
        response.err = true;
        response.msg = 'No esta permitido hacer llamados al sistema';
        res.json(response);
        return;
      }
      fs.writeFileSync('./codes/'+req.user.code+'.cu',req.body.source,function(err){
        var response = {};
        if(err){
          console.log(err);
          response.err=true;
          response.msg='Error al guardar el archivo';
          res.json(response);
        }
      });
      var child, code = './code/' + req.user.code,
          com = 'nvcc ./code/' +req.user.code +'.cu -o ' + './cuda/' + req.user.code;

      child = execSync(comp,
      function (error, stdout, stderr) {
        if (error) {
          console.log('compile error');
          console.log(error);
          console.log(error.stack);
          console.log('Error code compile: '+error.code);
          console.log('Signal received compile: '+error.signal);
          res.send("Compile Error\nError code: "+error.code+"\nSignal received run: "+error.signal+"\nError: "+ stderr);
          return;
        }
        if(stderr) {
          console.log('Compile STDERR1: '+stderr);
          res.send(stderr);
          return;
        }
        console.log('Compile STDOUT1: '+stdout);
        var child2 = execSync("./codes/" + req.user.code +"/"+req.user.code,{ timeout: 1000, killSignal: 'SIGTERM'}, function (error, stdout, stderr) {
          if (error) {
            console.log('run error');
            console.log(error.stack);
            console.log('Error code run:'+error.code);
            console.log('Signal received run: '+error.signal);
            res.send("Run time error\nError code: "+error.code+"\nSignal received run: "+error.signal);
            return;
          }
          console.log('Run STDERR: '+stderr);
          if(stderr.lenght > 0)
            res.send(stderr);
          else
            res.send(stdout);
        });

      });

    });

  });
}
