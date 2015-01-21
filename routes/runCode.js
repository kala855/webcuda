var express = require('express');
var router = express.Router();
var sys = require('sys');
var exec = require('child_process').exec;

router.post('/', function(req, res) {
  var child;
  child = exec("./codes/cuda", function (error, stdout, stderr) {
    if (error) {
     console.log(error.stack);
     console.log('Error code run:'+error.code);
     console.log('Signal received run: '+error.signal);
   }
   console.log('Run STDOUT: '+stdout);
   console.log('Run STDERR: '+stderr);
   jsonMessage = {stdoutput : stdout,
                  stderror: stderr};
   res.json(jsonMessage);
  });
});

module.exports = router;
