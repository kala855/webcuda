/* GET home page. */

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
    res.render('downloads', { user : req.user, title : "Downloads"});
  });

  app.post('/downloads', function(req,req) {
    var file = req.body.file;
    req.dowload('./uploads/' + file);
  });
}
