const ForumPost = require('../models/ForumPost');

exports.createPost = async (postData) => {
    const post = new ForumPost(postData);
    await post.save();
    return post;
};

exports.getPosts = async () => {
    return await ForumPost.find().populate('user', 'name');
};