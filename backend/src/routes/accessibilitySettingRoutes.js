const express = require('express');
const router = express.Router();
const AccessibilitySettingController = require('../controllers/accessibilitySettingController');
const authMiddleware = require('../middleware/authMiddleware');

// Get accessibility settings for a user
router.get('/:userId', authMiddleware, AccessibilitySettingController.getSettings);

// Update accessibility settings for a user
router.put('/:userId', authMiddleware, AccessibilitySettingController.updateSettings);

module.exports = router;