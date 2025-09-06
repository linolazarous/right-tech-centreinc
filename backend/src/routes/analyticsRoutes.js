import express from 'express';
const router = express.Router();
import analyticsController from '../controllers/analyticsController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateUserIdParam } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/progress/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('100req/hour'),
  analyticsController.getStudentProgress
);

router.get(
  '/engagement/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('100req/hour'),
  analyticsController.getEngagementMetrics
);

export default router;
