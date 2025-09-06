import express from 'express';
const router = express.Router();
import socialMediaController from '../controllers/socialMediaController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateSocialMediaPost } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

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

export default router;
