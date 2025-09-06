import express from 'express';
const router = express.Router();
import { createCourseContent } from '../controllers/contentCreationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateContentCreation } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/create',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateContentCreation,
  rateLimit('20req/day'),
  createCourseContent
);

export default router;
