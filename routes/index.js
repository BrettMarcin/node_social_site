var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


router.get('/', function(req, res){
    if(req.isAuthenticated()){
        res.render('home', {theUser: req.user});
    } else {
        res.render('index');
    }
});

router.post('/addUser', function(req, res){
    var first = (req.body.user_first).toString();
    var last = (req.body.user_last).toString();
    var email = (req.body.user_email).toString();
    var the_password = (req.body.user_password).toString();
    var the_username = (req.body.user_username).toString();

    //var errors = req.validationErrors();
    // if(errors){
    //     res.render('index', {
    //         errors:errors
    //     });
    // } else {
    //     var newUser = new User({
    //         first: first,
    //         last: last,
    //         email: email,
    //         username: the_username,
    //         password: the_password
    //     });
    var newUser = new User({
        first: first,
        last: last,
        email: email,
        username: the_username,
        password: the_password
    });

        User.findOne({'username' : newUser.username}, function(err, user){
            if(user){
                console.log('username already exists');
                res.redirect('/');
            }
        });

        User.findOne({'email' : newUser.email}, function(err, user) {
            if (user) {
                console.log('email already exists');
            } else {
                User.createUser(newUser, function(err, user){
                    if(err) throw err;
                    console.log(user);
                });
                res.redirect('/');
            }
        });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        res.redirect('/');
});

router.post('/changeFirst', function(req, res){
    User.update({_id: req.user.id}, {
        first: req.body.first_name
    }, function(err, user){
        res.redirect('/users/settings');
    });
});

router.post('/changeLast', function(req, res){
    User.update({_id: req.user.id}, {
        last: req.body.last_name
    }, function(err, user){
        res.redirect('/users/settings');
    });
});

router.post('/changeUsername', function(req, res){
    User.findOne({'username' : req.body.data}, function(err, user) {
        if (user) {
            res.json({status: 'failed'});
        } else {
            User.update({_id: req.user.id}, {
                username: req.body.data
            }, function(err, user){
                res.json({status: 'success'});
            });
        }
    });
});

module.exports = router;