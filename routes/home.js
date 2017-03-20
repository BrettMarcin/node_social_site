var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Post = require('../models/user');

router.get('/home', ensureAuthenticated, function(req, res){
    var thePosts = [{thePost: Post, theUser: User}];
    for(var i = 0; i < req.user.following.length; i++){
        User.findById(req.user.following[i].theID, function(err, user) {
            for(var j = 0; j < user.posts.length; j++){
                thePosts.push({thePost: user.posts[j], theUser: user});
            }
        });
    }
    function compare(a,b) {
        if (a.thePost.numDate < b.thePost.numDate)
            return -1;
        if (a.thePost.numDate > b.thePost.numDate)
            return 1;
        return 0;
    }
    thePosts.sort(compare);
    User.find({'username' : new RegExp('', 'i')}, function(err, users) {
        res.render('home', {theUser: req.user, postArray: thePosts, theUsers: users});
        }
    );
});

router.post('/processPostProfile',ensureAuthenticated, function(req, res){
    var today = new Date();
    var num = ((today.getMonth() + 1)*100) + (today.getDate() * 1) + (today.getFullYear() * 10000);
    User.update({_id: req.user.id}, {
        $push: {"posts": {author: req.user.username, content: req.body.userPost, date:  (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear(), numDate: num}, $position: 0}
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

router.post('/addLike', ensureAuthenticated, function(req, res){
    User.findOne({'username' : req.body.userID}, function(err, user){
        user.posts.update({_id: req.body.postID}, {
            $push: {"likes": req.user.id}
        }, function(err, user){
            res.json({status: 'success'});
        });
    });
});

router.post('/addLike', ensureAuthenticated, function(req, res){
    User.update({'username' : req.body.userID}, function(err, user){
        
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