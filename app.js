var LocalStrategy = require('passport-local').Strategy,
    File          = require('./models/file'),
    User          = require('./models/user'),
    bcrypt        = require('bcrypt'),
    bodyParser    = require('body-parser'),
    cookieParser  = require('cookie-parser'),
    engine        = require('ejs-locals'),
    env           = process.env.NODE_ENV || 'development',
    config        = require('./config/' + env),
    express       = require('express'),
    favicon       = require('serve-favicon'),
    flash         = require('connect-flash'),
    logger        = require('morgan'),
    mailer        = require('./config/mailer'),
    multer        = require('multer'),
    namespace     = require('express-namespace'),
    passport      = require('passport'),
    path          = require('path'),
    resourceful   = require('resourceful'),
    session       = require('express-session');


mailer.config();
  //var runCode = require('./routes/runCode');
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

passport.use(new LocalStrategy({
  usernameField: 'code'
},
function(username, password, done) {
  process.nextTick(function () {
    User.find( {code : username}, function(err, user) {
      if (err) { return done(err); }
      if (!user || user.length == 0) { return done(null, false, { message: 'Unknown user : ' + username }); }
      user = user[0];
      bcrypt.compare(password, user.password, function (err, res) {
        if (err)
          return done(null, false, {message : 'Wrong password.'}); // Dot is to differentiate it from other messages.

        if (res == false)
          return done(null, false, { message: 'Wrong password' });

        if (!user.activated)
          return done(null, false, { message: 'This user has not been activated' });
        return done(null, user);
      });
    })
  });
}) );

//express
var app = express();

// view engine setup
app.engine('html', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(multer({ dest: './uploads/',
               rename: function(fieldname, filename){
                 return filename;
               },
               onFileUploadStart: function (file) {
                 console.log(file.originalname + ' is starting ...');
               },
               onFileUploadComplete: function (file) {
                 var newfile = {};
                 newfile.name = file.originalname;
                 File.create(newfile, function(err, data) {
                   console.log(file.fieldname + ' uploaded to  ' + file.path);
                 });
               }
}));
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
require('./routes/admin.js')(app, passport);
require('./routes/users.js')(app, passport);
require('./routes/textEditor.js')(app, passport);
require('./routes/bugs.js')(app,passport);

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
    console.log(err);
    res.render('error', {
      message: err.message,
      error: err,
      user : req.user
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
