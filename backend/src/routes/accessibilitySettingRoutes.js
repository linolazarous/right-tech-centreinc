// src/routes/accessibilitySettingRoutes.js
import express from 'express';
import AccessibilitySettingController from '../controllers/accessibilitySettingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateUserIdParam } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/accessibility/:userId
 * @desc    Retrieve accessibility settings for a specific user
 * @access  Private (Authenticated users only)
 */
router.get(
  '/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('100req/hour'),
  AccessibilitySettingController.getSettings
);

/**
 * @route   PUT /api/accessibility/:userId
 * @desc    Update accessibility settings for a specific user
 * @access  Private (Authenticated users only)
 */
router.put(
  '/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('60req/hour'),
  AccessibilitySettingController.updateSettings
);

export default router;
