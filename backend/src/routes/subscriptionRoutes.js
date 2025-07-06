const express = require('express');
const router = express.Router();
const { subscribe, getUserSubscriptions } = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateSubscription } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/',
  authMiddleware,
  validateSubscription,
  rateLimit('5req/day'),
  subscribe
);

router.get(
  '/:userId',
  authMiddleware,
  rateLimit('50req/hour'),
  getUserSubscriptions
);

module.exports = router;
