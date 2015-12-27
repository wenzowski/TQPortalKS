var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var Env = require('./apps/environment');
var MyEnvironment = new Env();


var routes = require('./routes/grits/index');
var users = require('./routes/grits/users');

var app = express(),
    session = require('express-session'),
    uuid = require('node-uuid'),
    fs = require('fs');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser()); // collides with session
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  genid: function(req) {
    return uuid.v4(); // use UUIDs for session IDs
  },
  secret: 'collaborative sauce'
}));

/**
app.use('/', routes);
app.use('/users', users);

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
**/
////////////////////////////
// Plugin Routing
////////////////////////////
////////////////////////////
// Routes are added to Express from each plugin app
// Trailing routes added for 404 errors
////////////////////////////
MyEnvironment.init(function appFcn(err) {
  console.log('Environment initialized '+err);
  /**
   * Fire up an individual app from this <code>file</code>
   * @param file: a .js app file which exports a function(app,database)
   */
  function startApp(file) {
    var v = file;
    var px = require('./routes/' + v).plugin;
    px(app, MyEnvironment);
  };

  /**
   * load all *.js files from the /routes directory
   */
  function loadApps() {
    console.log("Server Starting-3");
    require('fs').readdirSync('./routes').forEach(function (file) {
      // only load javascript files
      if (file.indexOf(".js") > -1) {
        console.log('BURP ' + file);
        startApp(file);
      }
    });
  };
// boot the plugin apps
  loadApps();

////////////////////////////
//Server
////////////////////////////
// all environments
  app.set('port', parseInt(MyEnvironment.getConfigProperties().port) || 3000);

  http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
  });

});
module.exports = app;
