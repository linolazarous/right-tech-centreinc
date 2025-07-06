const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateForumPost } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/forum-posts',
  authMiddleware,
  validateForumPost,
  rateLimit('50req/hour'),
  forumController.createPost
);

module.exports = router;
