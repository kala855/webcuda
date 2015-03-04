var User  = require('../models/user'),
    utils = require('./utils.js'),
    fs    = require('fs');

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

    app.get('/uploads', utils.isAdmin,function(req,res){
      res.render('admin/uploads', {user: req.user});
    });


    app.post('/uploads', utils.isAdminAPI, function(req,res){
      res.jeson({ ok : true, data : 'File uploaded'});
    });

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
          return res.status(500).json({ok : false, error : 'The Admin user can\'t be deleted'});
      }); //user.find(__id)

      User.destroy({_id : id}, function(err, data){
        if (err)
          res.status(500).json({ok : false, error : err + 'err destroying'});
        else
          res.json({'ok' : true, 'data' : 'The user was successfully deleted'});
      }); //user.destroy

    }); //app.post(/del)

  }); // app.namespace('/admin')
}

