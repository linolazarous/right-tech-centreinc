import express from 'express';
import { createCourseContent } from '../controllers/contentCreationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateContentCreation } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/content/create
 * @desc    Create new course content (videos, articles, or assignments)
 * @access  Instructor, Admin
 */
router.post(
  '/create',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateContentCreation,
  rateLimit('20req/day'),
  createCourseContent
);

export default router;
