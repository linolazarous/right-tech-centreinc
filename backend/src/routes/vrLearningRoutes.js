import express from 'express';
const router = express.Router();
import { createLesson } from '../controllers/vrLearningController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateVRLesson } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/create',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateVRLesson,
  rateLimit('10req/day'),
  createLesson
);

export default router;
