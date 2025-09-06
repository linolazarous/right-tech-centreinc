import express from 'express';
const router = express.Router();
import arvrController from '../controllers/arvrController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateARVRContent } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

// Generate AR/VR content for a course
router.post(
  '/generate',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateARVRContent,
  rateLimit('10req/day'),
  arvrController.generateARVRContent
);

export default router;
