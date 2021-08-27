var express = require('express');
json = require('express-json');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local'),
    Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('');
var db = mongoose.connection;
console.log('connected to DB!');
async = require('async');
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
var routes = require('./routes/index');
var users = require('./routes/users');
var classes = require('./routes/classes');
var students = require('./routes/students');
var instructors = require('./routes/instructors');
var Class = require('./models/class');
const e = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());


// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect-Flash
app.use(flash());

// Makes the user object global in all views
app.get('*', function(req, res, next) {
    // put user into res.locals for easy access from templates
    res.locals.user = req.user || null;
    if (req.user) {
        res.locals.type = req.user.type;
    }
    next();
});


// Global Vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/classes', classes);
app.use('/students', students);
app.use('/instructors', instructors);

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

app.post('/getClass', async(req, res) => {
    let payload = req.body.payload.trim();
    let search = Class.find({ title: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
    res.send({ payload: e.value })
    console.log(payload);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/students/classes.handlebars')
});


module.exports = app;