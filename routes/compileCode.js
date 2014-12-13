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
    }

    console.log('Compile STDOUT: '+stdout);
    console.log('Compile STDERR: '+stderr);
    var jsonMessage = {stderror: stderr,
                      stdoutput: stdout
                      };
   console.log(jsonMessage);
   res.json(jsonMessage);

  });

});

module.exports = router;
