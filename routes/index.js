/* GET home page. */

module.exports = function(app,passport){
  app.get('/', function(req, res) {
    var msgh = req.flash() || req.flash('sucess');
    console.log("mensaje:");
    console.log(msgh);
    res.render('index', { title: 'Express', message: msgh });
  });
  app.get('/about', function(req,res) {
    res.render('about',{});
  });
  app.get('/agradecimientos', function(req,res) {
    res.render('agradecimientos',{});
  })
}
