var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var url = require('url');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var assert = require('assert');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
require('./models/post');

mongoose.connect('mongodb://localhost:27017/social', function(err){
    if(!err){
        console.log("Connected to Database");
    } else {
        console.log("Error Connecting to Database");
    }
});

var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/home');

app.set('view engine', 'ejs');

// express sessions
app.use(expressSession({secret: 'mySecretKey', resave: true,  saveUninitialized: true}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

app.use(express.static(__dirname + '/'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));



// Connect Flash
app.use(flash());
//Global functions
app.use(function(req, res, next){
    res.locals.sucess_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/users/', users);
app.use('/', routes);

server.listen(process.env.PORT || 3000);
console.log('Server running');

module.exports = app;