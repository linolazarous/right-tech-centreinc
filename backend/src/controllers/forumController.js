const ForumPost = require('../models/ForumPost');

   exports.createPost = async (req, res) => {
       try {
           const post = new ForumPost(req.body);
           await post.save();
           res.status(201).json(post);
       } catch (error) {
           res.status(400).json({ error: error.message });
       }
   };