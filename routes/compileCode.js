var express = require('express');
var router = express.Router();
var sys = require('sys');
var exec = require('child_process').exec;

/* GET home page. */
router.post('/', function(req, res) {
  var child;
  var path =  __dirname + "/../codes/";
  var name = req.body.cname + ".cc";
  console.log(req.body);
  var comp = "g++ " + path + name + " -o ./codes/cuda";
  console.log(comp);
  child = exec(comp, function (error, stdout, stderr) {
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

module.exports = router;
