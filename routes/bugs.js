var utils = require('./utils'),
    Bugs   = require('../models/bug');

module.exports = function(app, passport) {
  app.namespace('/bugs', function(){
    app.get('/', utils.isLoggedIn, function(req, res) {
      res.render('bugs', {user : req.user});
    });

    app.post('/submit', utils.isLoggedIn, function(req, res) {
      var bugs = req.body;
      bugs.reporter = req.user.code;
      Bugs.create(bugs, function (err, ans) {
        if (err)
          return res.render('error.html', {ok : false, error : err});
        req.flash('message' , 'bugs fue registrado exitosamente');
        res.redirect('/');
      });
    });

    app.get('/all', utils.isAdmin, function (req, res) {
      Bugs.all(function(err, data) {
        if (err) {
          req.flash('message', 'Ocurrió un error al consultar la base de datos');
          return res.redirect('/');
        }
        res.render('bugs/all.html', {user : req.user, data : data});
      });
    })

    app.get('/admin', utils.isAdmin, function (req, res) {
      Bugs.find( {solved : false} , function(err, data) {
       if (err) {
        req.flash('message', 'Ocurrió un error al consultar la base de datos');
        return res.redirect('/');
       }
       res.render('bugs/admin.html', {user : req.user, data : data});
      });
    });

    app.post('/solve', utils.isAdminAPI, function (req, res) {
      Bugs.find( { _id : req.param('_id')} , function(err, data) {
       if (err) {
        return res.status(500).json({ok : false, error : 'Ocurrió un error al consultar la base de datos'});
       } else if (data.length === 0) {
        return res.status(500).json({ok : false, error : 'No se encontró una petición con este id'});
       }

       data = data[0];
       data.solved = true;
       data.save();
       res.json({ok:true, data : 'La solicitud fue aprovada exitosamente'});
      });
    });


  });

};

