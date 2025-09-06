import express from 'express';
const router = express.Router();
import forumController from '../controllers/forumController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateForumPost } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/forum-posts',
  authMiddleware,
  validateForumPost,
  rateLimit('50req/hour'),
  forumController.createPost
);

export default router;
