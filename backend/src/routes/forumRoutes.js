import express from 'express';
import forumController from '../controllers/forumController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateForumPost } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/forum
 * @desc    Create a new forum discussion post
 * @access  Authenticated
 */
router.post(
  '/',
  authMiddleware,
  validateForumPost,
  rateLimit('50req/hour'),
  forumController.createPost
);

export default router;
