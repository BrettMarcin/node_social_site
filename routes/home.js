var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

router.get('/home', ensureAuthenticated, function(req, res){
    res.render('home', {theUser: req.user});
});

router.post('/processPost',ensureAuthenticated, function(req, res){
    var thePost = {author: req.user.username, content: req.body.userPost, date: '5'};
    var today = new Date();

    User.update({_id: req.user.id}, {
        $push: {"posts": {author: req.user.username, content: req.body.userPost, date: (today.getFullYear()* 10000) + ((today.getMonth()+ 1) * 100)  + today.getDay()}}
    }, function(err, user){
        res.redirect('home');
    });
});

router.get('/settings', ensureAuthenticated, function(req, res){
    res.render('settings', {theUser: req.user});
});

router.get('/logout', ensureAuthenticated, function(req, res){
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}


module.exports = router;