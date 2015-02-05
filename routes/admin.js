var User  = require('../models/user'),
    Codes = require('../models/code'),
    utils = require('./utils.js');


module.exports = function(app,passport){
  app.namespace('/admin', function (){
    app.get('/',utils.isAdmin,function(req,res){
      User.all(function(err,data){
        if(err)
          res.render('error', {'ok' : false, 'error' : err});
        else
          res.render('admin/users', {data : data, user : req.user});
      }); //User.find
    }); //app.get('/')

    app.post('/activate', utils.isAdminAPI, function(req,res){
      var id = req.param('id');
      User.update(id, {activated : true}, function(err,data){
        if(err)
          res.status(500).json({ok : false, error : err});
        else
          res.json({ ok : true, data : 'The user was successfully activated'});
      }); //User.update
    }); //app.post('/activate')

    app.post('/deactivate', utils.isAdminAPI, function(req,res){
      var id = req.param('id');

      User.find({_id : id}, function(err,user){
        if(err)
          return res.status(500).json({ok : false, error : 'Database error'});
        user = user[0];
        if(user.role === 'Admin')
          return res.status(500).json({ok : false, error : 'The admin user can\'t be deactivated'});
      }); //user.find(__id)

      User.update(id, {activated : false}, function(err,data){
       if(err)
          res.status(500).json({ok : false, error : err});
        else
          res.json({ ok : true, data : 'The user was successfully deactivated'});
      }); //User.update
    }); //app.post('/deactivate')

    app.post('/del/:id',utils.isAdmin,function (req,res) {
      var id = req.param('id');

      User.find({_id : id}, function(err,user){
        if(err)
          return res.status(500).json({ok : false, error : 'Database error'});
        user = user[0];
        if(user.role === 'Admin')
          return res.status(500).json({ok : false, error : 'El usuario administrador no puede ser eliminado'});
      }); //user.find(__id)

      User.destroy({_id : id}, function(err, data){
        if (err)
          res.status(500).json({ok : false, error : err});
        else 
          res.json({'ok' : true, 'data' : 'The user was successfully deleted'});
      }); //user.destroy

    }); //app.post(/del)

  }); // app.namespace('/admin')
}

