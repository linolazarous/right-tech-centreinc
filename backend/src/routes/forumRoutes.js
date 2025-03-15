const express = require('express');
    const forumController = require('../controllers/forumController');
    const router = express.Router();

    router.post('/forum-posts', forumController.createPost);

    module.exports = router;