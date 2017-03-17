var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Post = require('../models/post');
var PostsArray = Post[2];

router.get('/home', ensureAuthenticated, function(req, res){
    res.render('home', {theUser: req.user});
});

router.post('/processPostProfile',ensureAuthenticated, function(req, res){
    var today = new Date();
    User.update({_id: req.user.id}, {
        $push: {"posts": {author: req.user.username, content: req.body.userPost, date:  (today.getMonth() + 1) + '/' + today.getDay() + '/' + today.getFullYear()}, $position: 0}
    }, function(err, user){
        res.redirect('profile/' + req.user.username);
    });
});

router.post('/removePost', ensureAuthenticated, function(req, res){
    User.update({_id: req.user.id}, {
        $pull: {"posts": {_id : req.body.theData}}
    }, function(err, user){
        res.redirect('profile');
    });
});

router.get('/profile/:username', ensureAuthenticated, function(req, res){
    User.find({'username' : new RegExp('', 'i')}, function(err, users){
        User.findOne({'username' : req.param('username')}, function(err, user) {
            if (user) {
                res.render('profile', {theUser: user, currentUser: req.user, theUsers: users});
            } else {
                res.redirect('/');
            }
        });
    });
});

router.post('/followUser', ensureAuthenticated, function(req, res){
    var profileUser = req.body.profileUser;
    User.update({_id: profileUser}, {
        $push: {"followers": {theID: req.user.id}}
    }, function(err, user){
        User.update({_id: req.user.id}, {
            $push: {"following": {theID: profileUser}}
        }, function(err, user){
            res.json({status: 'success'});
        });
    });
});

router.post('/unfollowUser', ensureAuthenticated, function(req, res){
    var profileUser = req.body.profileUser;
    User.update({_id: profileUser}, {
        $pull: {"followers": {theID: req.user.id}}
    }, function(err, user){
        User.update({_id: req.user.id}, {
            $pull: {"following": {theID: profileUser}}
        }, function(err, user){
            res.json({status: 'success'});
        });
    });
});

router.get('/settings', ensureAuthenticated, function(req, res){
    res.render('settings', {theUser: req.user});
});

router.get('/logout', ensureAuthenticated, function(req, res){
    req.logout();
    res.redirect('/');
});

router.post('/search', ensureAuthenticated, function(req, res){
    User.find({'username' : new RegExp((req.body.search).toString(), 'i')}, function(err, users){
        res.render('search', {theUsers: users, theUser: req.user});
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}


module.exports = router;