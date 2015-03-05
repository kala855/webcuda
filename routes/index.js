File  = require('../models/file'),

module.exports = function(app,passport){
  app.get('/', function(req, res) {
    var msgh =  req.flash('message') || req.flash('sucess');
    res.render('index', { user : req.user, message: msgh });
  });

  app.get('/about', function(req,res) {
    res.render('about',{user : req.user, title : "About :"} );
  });

  /*app.get('/agradecimientos', function(req,res) {
    res.render('agradecimientos',{user : req.user });
  });*/

  app.get('/downloads',function(req, res) {
    File.all(function(err,data){
      if (err) {
        req.flash('message', 'Database error');
        return res.redirect('/');
      }
      res.render('downloads', { user : req.user, title : "Downloads", data : data});
    });
  });

  app.post('/downloads', function(req,res) {
    var file = req.body.file;
    console.log('./uploads' + file);
    res.download('./uploads/' + file);
  });
}
