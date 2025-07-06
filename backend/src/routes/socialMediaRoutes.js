const express = require('express');
const router = express.Router();
const socialMediaController = require('../controllers/socialMediaController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateSocialMediaPost } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/post/:platform',
  authMiddleware,
  roleMiddleware(['admin', 'marketing']),
  validateSocialMediaPost,
  rateLimit('10req/hour'),
  socialMediaController.createPost
);

router.get(
  '/posts',
  authMiddleware,
  rateLimit('50req/hour'),
  socialMediaController.getUserPosts
);

router.delete(
  '/posts/:postId',
  authMiddleware,
  rateLimit('20req/hour'),
  socialMediaController.deletePost
);

module.exports = router;
