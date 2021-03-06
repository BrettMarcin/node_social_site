var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var multer  = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +  path.extname(file.originalname));
    }
});
var upload = multer({ storage: storage });
var fs = require('fs');


router.get('/', function(req, res){
    if(req.isAuthenticated()){
        res.redirect('users/home');
    } else {
        res.render('index');
    }
});

router.post('/addUser', function(req, res){
    var newUser = new User({
        first: (req.body.user_first).toString(),
        last: (req.body.user_last).toString(),
        email: (req.body.user_email).toString(),
        username: (req.body.user_username).toString(),
        password: (req.body.user_password).toString(),
        img: {data: '/public/images/default.png', contentType: 'image/png'}
    });
    newUser.admin = req.body.adminStatus;
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
                });
            }
            res.redirect('/');
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

router.post('/changePassword', function(req, res){
    User.changePassword(req.user,req.body.data, function(err, user){
        if(err) throw err;
        res.send('settings');
    });
});

router.post('/changeImage', upload.single('file'), function(req, res, next){
    var file = req.file;
    if(req.user.img.data != '/public/images/default.png'){
        var thePath = (req.user.img.data).toString().substr(1, req.user.img.data.toString().length);
        fs.unlink(thePath);
    }
    User.update({_id: req.user.id}, {
        img: {data: '/' + file.path, contentType: file.mimetype}
    }, function(err, user){
        res.redirect('/users/settings');
    });
});

router.get('/adminView', isAdmin, function(req, res){
    User.find({'username' : new RegExp('', 'i')}, function(err, users){
        res.render('admin_view', {theUsers: users, theUser: req.user});
    });
});

router.post('/removeUser', function(req, res){
    console.log(req.body.currentUser);

        for (var i = 0; i < req.body.currentUser.followers.length; i++) {
            User.update({_id: req.body.currentUser.followers[i].theID}, {
                $pull: {"following": {theID: req.body.currentUser.id}}
            }, function (err, user) {
            });
        }
            for (var i = 0; i < req.body.currentUser.following.length; i++) {
                User.update({_id: req.body.currentUser.following[i].theID}, {
                    $pull: {"followers": {theID: req.body.currentUser.id}}
                }, function (err, user) {
                });
            }

    if(req.user.img.data != '/public/images/default.png' && req.user.img.data != null){
        var thePath = (req.user.img.data).toString().substr(1, req.user.img.data.toString().length);
        fs.unlink(thePath);
    }
    User.update({_id: req.body.currentUser.id}, {
        username: null,
        email: null
    }, function(err, user){

    });

    User.remove({ _id: req.body.theID }, function(err) {
        res.redirect('adminView');
    });
});

function isAdmin(req, res, next) {
    if (req.user.admin) {
        return next();
    } else {
        res.redirect('/');
    }
}

module.exports = router;