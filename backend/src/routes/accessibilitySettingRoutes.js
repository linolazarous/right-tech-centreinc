import express from 'express';
const router = express.Router();
import AccessibilitySettingController from '../controllers/accessibilitySettingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateUserIdParam } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

// Get accessibility settings for a user
router.get(
  '/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('100req/hour'),
  AccessibilitySettingController.getSettings
);

// Update accessibility settings for a user
router.put(
  '/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('60req/hour'),
  AccessibilitySettingController.updateSettings
);

export default router;
