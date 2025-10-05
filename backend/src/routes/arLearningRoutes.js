import express from 'express';
import { createLesson } from '../controllers/arLearningController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateARContent } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/ar-learning
 * @desc    Create a new Augmented Reality lesson
 * @access  Instructor or Admin
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateARContent,
  rateLimit('20req/day'),
  createLesson
);

export default router;
