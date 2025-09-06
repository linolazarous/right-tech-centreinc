import express from 'express';
const router = express.Router();
import { createLesson, getAllLessons } from '../controllers/microLearningController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateMicroLesson } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateMicroLesson,
  rateLimit('20req/day'),
  createLesson
);

router.get(
  '/',
  rateLimit('1000req/hour'),
  getAllLessons
);

export default router;
