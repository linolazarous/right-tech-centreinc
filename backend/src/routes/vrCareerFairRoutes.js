import express from 'express';
const router = express.Router();
import { createEvent } from '../controllers/vrCareerFairController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateVREvent } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/create-event',
  authMiddleware,
  roleMiddleware(['admin', 'career_services']),
  validateVREvent,
  rateLimit('5req/day'),
  createEvent
);

export default router;
