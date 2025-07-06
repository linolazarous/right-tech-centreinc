const express = require('express');
const router = express.Router();
const AccessibilitySettingController = require('../controllers/accessibilitySettingController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUserIdParam } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

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

module.exports = router;
