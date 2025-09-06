import express from 'express';
const router = express.Router();
import learningPathController from '../controllers/learningPathController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateUserIdParam } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/learning-path/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('50req/hour'),
  learningPathController.getLearningPath
);

export default router;
