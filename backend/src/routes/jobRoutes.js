const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateJobQuery } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/jobs/recommendations',
  authMiddleware,
  validateJobQuery,
  rateLimit('50req/hour'),
  jobController.getJobRecommendations
);

module.exports = router;
