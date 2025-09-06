import express from 'express';
const router = express.Router();
import recommendationController from '../controllers/recommendationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateRecommendationQuery } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/recommendations',
  authMiddleware,
  validateRecommendationQuery,
  rateLimit('50req/hour'),
  recommendationController.getRecommendations
);

export default router;
