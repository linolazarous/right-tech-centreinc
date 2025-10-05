import express from 'express';
import analyticsController from '../controllers/analyticsController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateUserIdParam } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/analytics/progress/:userId
 * @desc    Get student learning progress analytics
 * @access  Authenticated users
 */
router.get(
  '/progress/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('100req/hour'),
  analyticsController.getStudentProgress
);

/**
 * @route   GET /api/analytics/engagement/:userId
 * @desc    Get student engagement metrics
 * @access  Authenticated users
 */
router.get(
  '/engagement/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('100req/hour'),
  analyticsController.getEngagementMetrics
);

export default router;
