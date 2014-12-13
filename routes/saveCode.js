var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/', function(req, res) {
  fs.writeFile('./codes/'+req.body.fileName+'.cc',req.body.source,function(err){
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

module.exports = router;
