const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRecommendationQuery } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/recommendations',
  authMiddleware,
  validateRecommendationQuery,
  rateLimit('50req/hour'),
  recommendationController.getRecommendations
);

module.exports = router;
