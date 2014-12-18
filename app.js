var express       = require('express'),
    session       = require('express-session'),
    path          = require('path'),
    favicon       = require('serve-favicon'),
    logger        = require('morgan'),
    env           = process.env.NODE_ENV || 'development',
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    passport      = require('passport'),
    namespace    = require('express-namespace'),
    resourceful   = require('resourceful'),
    LocalStrategy = require('passport-local').Strategy,
    flash         = require('connect-flash');

var config = require('./config/' + env);
//var runCode = require('./routes/runCode');

var User = require('./models/user');
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.find({_id : id},function (err, user) {
    if (err || user.length == 0)
      done(err, null);
    else
      done(err, user[0]);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      User.find( {username : username}, function(err, user) {
        if (err) { return done(err); }
        if (!user || user.length == 0) { return done(null, false, { message: 'Usuario desconocido : ' + username }); }
        user = user[0];
        bcrypt.compare(password, user.password, function (err, res) {
          if (err)
            return done(null, false, {message : 'Contraseña inválida.'}); // Dot is to differentiate it from other messages.

          if (res == false)
            return done(null, false, { message: 'Contraseña inválida' });

          if (user.activated !== 'activated')
            return done(null, false, {message: 'Su cuenta aún no ha sido activada'})
          return done(null, user);
        });
      })
    });
  }
));

//express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'CUDAtmp',
  resave: false,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/index.js')(app, passport);
//require('./routes/admin.js')(app, passport);
require('./routes/users.js')(app, passport);
require('./routes/textEditor.js')(app, passport);

//app.use('/compiler/textEditor', textEditor);
//app.use('/compiler/textEditor/saveCode', saveCode);
//app.use('/compiler/textEditor/compileCode', compileCode);
//app.use('/compiler/textEditor/runCode', runCode);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

resourceful.use('couchdb', config);

module.exports = app;
