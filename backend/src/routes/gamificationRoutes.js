const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBadgeAward } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/award-badge',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateBadgeAward,
  rateLimit('100req/day'),
  gamificationController.awardBadge
);

module.exports = router;
