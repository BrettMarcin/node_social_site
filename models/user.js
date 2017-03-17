var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var postSchema = new mongoose.Schema({
    author: String,
    content: String,
    date: String,
    likes: [{theID: String}]
});

var UserSchema = mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    first: {
        type: String
    },
    posts: [postSchema],
    last: {
        type: String
    },
    followers: [{theID: String}],
    following: [{theID: String}],
    img: { data: Buffer, contentType: String }

});

var Post = module.exports = mongoose.model('Post', postSchema);
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByUsername = function(username, callback){
    User.findOne({'username' : username}, callback);
};

module.exports.getUserByEmail = function(username, callback){
    User.findOne({'email' : username}, callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

// module.exports.updateFirstName = function(id, name, callback){
//     User.findById(id, callback);
// };

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};

module.exports.changePassword = function(newUser, newPassword, callback){
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(newPassword, salt, function(err, hash) {
            User.findOne({'username' : newUser.username}, function(err, user) {
                if (err) {
                    throw err;
                } else {
                    User.update({_id: newUser.id}, {
                        password: hash
                    }, callback);
                }
            });
        });
    });
};

module.exports.getAllUsers = function(callback){
    User.find({}, callback);
};
