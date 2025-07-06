const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUserIdParam } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/progress/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('100req/hour'),
  analyticsController.getStudentProgress
);

router.get(
  '/engagement/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('100req/hour'),
  analyticsController.getEngagementMetrics
);

module.exports = router;
