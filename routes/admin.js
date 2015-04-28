var User  = require('../models/user'),
    utils = require('./utils.js'),
    File  = require('../models/file'),
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
      File.all(function(err,data){
        if (err) {
          req.flash('message', 'Database error');
          return res.redirect('/');
        }
        res.render('admin/uploads', {user: req.user, data : data});
      });
    });


    app.post('/uploads', utils.isAdminAPI, function(req,res){
        res.json({ ok : true, data : 'File uploaded'});
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
        User.destroy( id, function(err, data){
          if (err)
            return res.status(500).json({ok : false, error : err + 'err destroying'});
          return res.json({'ok' : true, 'data' : 'The user was successfully deleted'});
        }); //user.destroy

      }); //user.find(__id)
    }); //app.post(/del)

    app.post('/delFile/:id', function (req,res) {
      var id = req.param('id');
      File.find({_id : id}, function(err, file){
        if(err)
          return res.status(500).json({ok : false, error : 'Database error'});
        var name = file[0].name;
        File.destroy( id, function(err, data){
          if (err)
            return res.status(500).json({ok : false, error : err + 'err destroying'});
          fs.unlink('./uploads/' + name, function (err){
            if(err)
              console.log('error removing executable');
          });
          return res.json({'ok' : true, 'data' : 'The file was successfully deleted'});
        }); //file.destroy

      }); //file.find(__id)
    }); //app.post(/delFile)

  }); // app.namespace('/admin')
}

