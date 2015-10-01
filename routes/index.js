var File  = require('../models/file'),
fs    = require('fs');

module.exports = function(app,passport){
  app.get('/', function(req, res) {
    var msgh =  req.flash('message') || req.flash('sucess');
    res.render('index', { user : req.user, message: msgh });
  });

  app.get('/about', function(req,res) {
    res.render('about',{user : req.user, title : "About :"} );
  });

  /*app.get('/agradecimientos', function(req,res) {
   *     res.render('agradecimientos',{user : req.user });
   *       });*/

  app.get('/downloads',function(req, res) {
    if(!req.isAuthenticated()) {
      return res.render('users/signin');
    }
    File.all(function(err,data){
      if (err) {
        req.flash('message', 'Database error');
        return res.redirect('/');
      }
      var image = req.user.code + '.png';
      console.log(image);
      fs.exists('./outputs/' + image, function(exists){
        console.log(exists);
        console.log(data);
        if(exists)
          data.push({name : image});
        console.log(data);
        res.render('downloads', { user : req.user, title : "Downloads", data : data});
      });
    });
  });

  app.get('/downloads/:file', function(req,res) {
    if(!req.isAuthenticated()) {
      return res.render('users/signin');
    }
    var file = req.params.file,
    down = '';
    if( file.search(/.*\.png/) !== -1 ) {
      down += './outputs/' + file;
    } else {
      down += './uploads/' + file;
    }
    console.log(down);
    res.download(down);
  });
}

