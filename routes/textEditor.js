var fs   = require('fs'),
    sys  = require('sys'),
    exec = require('child_process').exec;

/* GET home page. */


module.exports = function(app,passport){
  app.namespace('/compiler',function(){
    app.get('/textEditor', function(req, res) {
      // TMP mientras se prueba
      if(req.isAuthenticated()){
        res.render('textEditor/textEditor', {user : req.user, title: 'Unsaved'});
      }else
        res.render('users/signin');
    });


    app.post('/textEditor/saveCode', function(req, res) {
      fs.writeFile('./codes/'+req.body.fileName+'.cu',req.body.source,function(err){
        var response = {};
        if(err){
          console.log(err);
          response.err=true;
          response.msg='Error al guardar el archivo';
        }else{
          console.log('Archivo creado exitosamente');
          response.err=false;
          response.msg='Archivo creado exitosamente';
        }
        res.json(response);
      });
    });
    /*
     *
     * QUITAR EL TEXTEDITOR!! SE VE FEO
     *
     *
     *
     */
    app.post('/textEditor/compileCode', function(req, res) {
      var child;
      var path =  __dirname + "/../codes/";
      var name = req.body.cname + ".cu";
      console.log(req.body);
      var comp = "nvcc " + path + name + " -o ./codes/cuda";
      console.log(comp);
      child = exec(comp,{ timeout: 1000,
                          maxBuffer: 200*1024,
                          killSignal: 'SIGTERM'},
      function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
          console.log('Error code compile: '+error.code);
          console.log('Signal received compile: '+error.signal);
          res.send("Error code: "+error.code+"\nSignal received run: "+error.signal);
          return;
        }
        if(stderr) {
          console.log('Compile STDERR1: '+stderr);
          res.send(stderr);
          return;
        }
        console.log('Compile STDOUT1: '+stdout);
        var child2 = exec("./codes/cuda", function (error, stdout, stderr) {
          if (error) {
            console.log(error.stack);
            console.log('Error code run:'+error.code);
            console.log('Signal received run: '+error.signal);
            res.send("Error code: "+error.code+"\nSignal received run: "+error.signal);
          }
          console.log('Run STDOUT: '+stdout);
          console.log('Run STDERR: '+stderr);
          res.send(stdout);
        });

      });
    });
  });
}
