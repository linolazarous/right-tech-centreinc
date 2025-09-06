import express from 'express';
const router = express.Router();
import careerCoachingController from '../controllers/careerCoachingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateUserIdParam } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/advice/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('50req/hour'),
  careerCoachingController.getCareerAdvice
);

export default router;
