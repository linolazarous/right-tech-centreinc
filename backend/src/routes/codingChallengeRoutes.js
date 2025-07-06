const express = require('express');
const router = express.Router();
const codingChallengeController = require('../controllers/codingChallengeController');
const { validateChallengeQuery } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/challenges',
  validateChallengeQuery,
  rateLimit('1000req/hour'),
  codingChallengeController.getCodingChallenges
);

module.exports = router;
