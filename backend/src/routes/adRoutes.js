const express = require('express');
const router = express.Router();
const { generateAndPostAd } = require('../controllers/adController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateAdCreation } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/generate-ad',
  authMiddleware,
  roleMiddleware(['admin', 'marketing']),
  validateAdCreation,
  rateLimit('10req/day'),
  generateAndPostAd
);

module.exports = router;
