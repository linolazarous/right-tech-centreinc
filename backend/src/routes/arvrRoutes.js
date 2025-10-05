import express from 'express';
import arvrController from '../controllers/arvrController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateARVRContent } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/ar-vr
 * @desc    Generate Augmented or Virtual Reality content for a course
 * @access  Instructor, Admin
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateARVRContent,
  rateLimit('10req/day'),
  arvrController.generateARVRContent
);

export default router;
