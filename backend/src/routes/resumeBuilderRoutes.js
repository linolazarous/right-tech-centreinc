import express from 'express';
const router = express.Router();
import resumeBuilderController from '../controllers/resumeBuilderController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateUserIdParam } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/generate/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('5req/day'),
  resumeBuilderController.generateResume
);

export default router;
