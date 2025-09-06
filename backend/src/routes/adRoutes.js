import express from 'express';
const router = express.Router();
import { generateAndPostAd } from '../controllers/adController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateAdCreation } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/generate-ad',
  authMiddleware,
  roleMiddleware(['admin', 'marketing']),
  validateAdCreation,
  rateLimit('10req/day'),
  generateAndPostAd
);

export default router;
