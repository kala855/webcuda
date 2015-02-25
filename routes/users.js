var User    = require('../models/user'),
    bcrypt  = require('bcrypt'),
    crypto  = require('crypto'),
    env     = process.env.NODE_ENV || 'development';

/* GET users listing. */

module.exports = function(app,passport){
  app.namespace('/users',function(){

   app.get('/signin', function(req, res) {
      if (!req.isAuthenticated()) {
        var msg = req.flash('error');
        if (msg.length == 0) msg = null;
        res.render('users/signin', {user : req.user, message : msg});
      }
      else
        res.render('users/resignin', {user : req.user});
    });

    app.get('/signup',function(req, res){
      res.render('users/signup',{user : req.user, message : req.flash('message')});
    });

    app.post('/signin', passport.authenticate('local', {
      successRedirect : 'aftersignin',
      failureRedirect : 'signin',
      successFlash : 'Welcome!',
      failureFlash : true
    }));

    app.get('/aftersignin', function(req, res) {
      req.flash('message', 'Welcome ' + req.user.name );
      res.redirect('../');
    });

    app.get('/logout', function(req, res) {
      req.logout();
      var red = req.param('red');
      if (red == undefined)
        red = '../';
      res.redirect(red);
    });

    app.post('/signup', function(req, res) {
      var rounds = (env == 'development') ? 10 : 13;
      var user   =  req.body;
      User.find( {code : user.code}, function(err, ans) {
        if (err)
          return res.render('error', {ok : false, error : err});
        if (ans.length == 0) {
          User.find( {email : user.email}, function(err, ans) {
            if (err)
              return res.render('error', {ok : false, error : err});
            if (ans.length == 0) {
                if (user.password != user.passwordConfirm) {
                  req.flash('message', 'The passwords don\'t match');
                  console.log('no match');
                  return res.redirect('/users/signup');
                } else {
                  if (user.password.length < 8) {
                    req.flash('message', 'Your password is too short');
                    console.log('short');
                    return res.redirect('/users/signup');
                  }

                  user.passwordConfirm = null;
                  bcrypt.genSalt(rounds, function (err, salt) {
                    bcrypt.hash(user.password , salt, function (err, hash) {
                      user.password = hash;

                      crypto.randomBytes(20, function(err, buf) {
                        User.create(user, function(err, data) {
                          if (err)
                            return res.render('error', {ok : false , error : 'Data base error: ' + err.validate.errors[0].message});
                          else {
                            req.flash('message', 'Welcome ' + user.name + ', wait until your account is activated');
                            return res.redirect('/');
                          }
                        });
                      });
                    });
                  });
                }
            } else {
              req.flash('message', 'The email "' + user.email + '" is already in use!');
              return res.redirect('/users/signup');
            }
          });
        } else {
          req.flash('message', 'The student code ' + user.code + '" is already in use!');
          return res.redirect('/users/signup');
        }
      });
    });
  });
}
