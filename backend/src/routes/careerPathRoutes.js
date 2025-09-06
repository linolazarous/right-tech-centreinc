import express from 'express';
const router = express.Router();
import careerPathController from '../controllers/careerPathController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateUserIdParam } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/recommend/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('50req/hour'),
  careerPathController.recommendCareerPath
);

export default router;
