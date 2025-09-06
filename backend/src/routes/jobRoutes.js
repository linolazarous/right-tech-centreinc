import express from 'express';
const router = express.Router();
import jobController from '../controllers/jobController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateJobQuery } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/jobs/recommendations',
  authMiddleware,
  validateJobQuery,
  rateLimit('50req/hour'),
  jobController.getJobRecommendations
);

export default router;
