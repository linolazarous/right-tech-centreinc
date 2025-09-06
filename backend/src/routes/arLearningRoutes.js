import express from 'express';
const router = express.Router();
import { createLesson } from '../controllers/arLearningController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateARContent } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/create',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateARContent,
  rateLimit('20req/day'),
  createLesson
);

export default router;
