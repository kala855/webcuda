var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/', function(req, res) {

  fs.writeFile('./codes/cuda.cu',req.body.source,function(err){
    if(err){
      console.log(err);
    }else{
      console.log('Archivo creado exitosamente');
    }
  });
  res.send('{"OK":true}');
});

module.exports = router;
