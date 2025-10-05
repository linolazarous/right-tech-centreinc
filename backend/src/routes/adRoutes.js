// src/routes/adRoutes.js
import express from 'express';
import { generateAndPostAd } from '../controllers/adController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateAdCreation } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/ads/generate-ad
 * @desc    Generate and post a new advertisement
 * @access  Private (Admin & Marketing roles only)
 */
router.post(
  '/generate-ad',
  authMiddleware,
  roleMiddleware(['admin', 'marketing']),
  validateAdCreation,
  rateLimit('10req/day'),
  generateAndPostAd
);

export default router;
