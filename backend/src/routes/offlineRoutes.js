import express from 'express';
const router = express.Router();
import offlineController from '../controllers/offlineController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateCourseId } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/download-course/:courseId',
  authMiddleware,
  validateCourseId,
  rateLimit('10req/day'),
  offlineController.downloadCourse
);

export default router;
