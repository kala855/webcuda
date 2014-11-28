var express = require('express');
var router = express.Router();
var sys = require('sys');
var exec = require('child_process').exec;

/* GET home page. */
router.post('/', function(req, res) {
  var child;
  child = exec("nvcc ./codes/cuda.cu -o ./codes/cuda", function (error, stdout, stderr) {
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

  res.send(JSON.stringify(jsonMessage));
});

 });

module.exports = router;
