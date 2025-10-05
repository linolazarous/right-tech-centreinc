import express from 'express';
import careerCoachingController from '../controllers/careerCoachingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateUserIdParam } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/career-coaching/:userId
 * @desc    Get AI-driven career advice for a specific user
 * @access  Authenticated
 */
router.get(
  '/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('50req/hour'),
  careerCoachingController.getCareerAdvice
);

export default router;
