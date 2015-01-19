/* GET home page. */

module.exports = function(app,passport){
  app.get('/', function(req, res) {
    var msgh = req.flash() || req.flash('sucess');
    res.render('index', { user : req.user, title: 'Web CUDA', message: msgh });
  });
  app.get('/about', function(req,res) {
    res.render('about',{user : req.user} );
  });
  app.get('/agradecimientos', function(req,res) {
    res.render('agradecimientos',{user : req.user });
  })
}
