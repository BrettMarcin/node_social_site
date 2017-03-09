var mongoose = require('mongoose');
//var postModel = require('mongoose').model('post', 'postSchema');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var postSchema = new mongoose.Schema({
    author: String,
    content: String,
    date: String
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
    }

});

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
