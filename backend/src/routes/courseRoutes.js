import express from 'express';
const router = express.Router();
import courseController from '../controllers/courseController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateCourseCreation } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/courses',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateCourseCreation,
  rateLimit('20req/day'),
  courseController.createCourse
);

router.get(
  '/courses',
  rateLimit('1000req/hour'),
  courseController.getCourses
);

export default router;
