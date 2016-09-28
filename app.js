// Include packages

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expValidator = require('express-validator');
var session = require('express-session');

// Include routes
var routes = require('./routes/public');
var developers = require('./routes/developers');
var odps = require('./routes/odps');
var containers = require('./routes/containers');
var applications = require('./routes/applications');
var repositories = require('./routes/repositories');

var app = express();

// Include dbHandler
var db = require('./models/dbHandler');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expValidator());

app.use(session({

    secret: "mobile_age_secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 }

}));

app.use('/', routes);
app.use('/developers', developers);
app.use('/odps', odps);
app.use('/containers', containers);
app.use('/applications', applications);
app.use('/repositories', repositories);

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


module.exports = app;
