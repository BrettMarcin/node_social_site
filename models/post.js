var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    author: {
        type: String
    },
    content: {
        type: String
    },
    date: {
        type: String
    }

});

var Post = module.exports = mongoose.model('Post', UserSchema);

module.exports.createPost = function(newPost, callback){
    newPost.save(callback);
};