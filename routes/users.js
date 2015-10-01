var User         = require('../models/user'),
    bcrypt       = require('bcrypt'),
    crypto       = require('crypto'),
    env          = process.env.NODE_ENV || 'development',
    mailer       = require('../config/mailer'),
    randomstring = require('randomstring'),
    rounds = (env === 'development') ? 10 : 13;

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

    app.get('/change', function(req, res) {
      if(req.isAuthenticated())
        return res.render('users/change', {user : req.user, message : req.flash('message')});
      else
        return res.render('/');
    });

    app.get('/recover', function(req, res) {
      res.render('users/recover', {user : req.user, message : req.flash('message')});
    });

    app.post('/change', function(req, res) {
      var rounds = (env === 'development') ? 10 : 13,
      user = req.user,
      npass = req.body.password,
      cpass = req.body.passwordConfirm;

      if (npass !== cpass) {
        req.flash('message', 'The passwords don\'t match');
        console.log('no match');
        return res.redirect('/user/change');
      } else {
        if (user.password.length < 8) {
          req.flash('message', 'Your password is too short');
          return res.redirect('/users/change');
        }
        bcrypt.genSalt(rounds, function (err, salt) {
          bcrypt.hash(npass , salt, function (err, hash) {
            user.password = hash;

            crypto.randomBytes(20, function(err, buf) {
              User.save(user, function(err, data) {
                if (err)
                  return res.render('error', {ok : false , error : 'Data base error: ' + err.validate.errors[0].message});
                else {
                  req.flash('message', 'Your password was successfully changed');
                  return res.redirect('/');
                }
              });
            });
          });
        });
      }
    });

    app.post('/recover', function(req, res) {
      User.find({code : req.body.code}, function(err, ans) {
        if (err)
          return res.render('error', {ok : false, error : err});
        console.log(ans.length);
        if(ans.length === 0) {
          req.flash('message', 'The user with code ' + req.body.code + ' don\'t exist');
          return res.redirect('/users/recover');
        }
        var user = ans[0];
        to   = user.email,
        pass = randomstring.generate(8);
        text = '<h3> Temporal password </h3>' +
          '  <p> Hello! ' + user.name + ', your new password is ' + pass + ' please change it after your next sign in';
        mailer.sendMail('alejandro@sirius.utp.edu.co', to, 'Cuda Web Compiler', text, function(err) {
          if (err)
            return res.render('error', {ok: false, error : err});
          bcrypt.genSalt(rounds, function (err, salt) {
            bcrypt.hash(pass, salt, function (err, hash) {
              user.password = hash;
              crypto.randomBytes(20, function(err, buf) {
                User.save(user, function(err, data) {
                  if (err)
                    return res.render('error', {ok : false , error : 'Data base error: ' + err.validate.errors[0].message});
                  else {
                    req.flash('message', 'Check your email');
                    return res.redirect('/');
                  }
                });
              });
            });
          });
        });
      });
    });

    app.post('/signin', passport.authenticate('local', {
      successRedirect : 'aftersignin',
      failureRedirect : 'signin',
      successFlash : 'Welcome!',
      failureFlash : true
    }));

    app.post('/signup', function(req, res) {
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
          req.flash('message', 'The student code "' + user.code + '" is already in use!');
          return res.redirect('/users/signup');
        }
      });
    });
  });
}
