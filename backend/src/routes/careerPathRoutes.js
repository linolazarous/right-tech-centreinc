import express from 'express';
import careerPathController from '../controllers/careerPathController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateUserIdParam } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/career-path/:userId/recommend
 * @desc    Recommend personalized career paths based on user's progress
 * @access  Authenticated
 */
router.get(
  '/:userId/recommend',
  authMiddleware,
  validateUserIdParam,
  rateLimit('50req/hour'),
  careerPathController.recommendCareerPath
);

export default router;
