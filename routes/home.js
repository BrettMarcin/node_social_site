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
        $push: {"posts": {author: req.user.username, content: req.body.userPost, date:  (today.getMonth() + 1) + '/' + today.getDay() + '/' + today.getFullYear()}, $position: 0}
    }, function(err, user){
        res.redirect('home');
    });

    // User.find({ _id: req.user.id }, function(err, user) {
    //     user.posts.unshift({author: req.user.username, content: req.body.userPost, date:  (today.getMonth() + 1) + '/' + today.getDay() + '/' + today.getFullYear()});
    //     // user.save(function(err){
    //     //     res.redirect('home');
    //     // });
    //     res.redirect('home');
    // });
});

router.post('/removePost', ensureAuthenticated, function(req, res){
    User.update({_id: req.user.id}, {
        $pull: {"posts": {_id : req.body.theData}}
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