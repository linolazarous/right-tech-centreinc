const express = require('express');
const router = express.Router();
const BadgeController = require('../controllers/badgeController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBadgeAssignment } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

// Get all badges
router.get(
  '/badges',
  rateLimit('1000req/hour'),
  BadgeController.getAllBadges
);

// Assign a badge to a user
router.post(
  '/badges/assign',
  authMiddleware,
  validateBadgeAssignment,
  rateLimit('100req/day'),
  BadgeController.assignBadgeToUser
);

module.exports = router;
