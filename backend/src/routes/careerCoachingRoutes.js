const express = require('express');
const router = express.Router();
const careerCoachingController = require('../controllers/careerCoachingController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUserIdParam } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/advice/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('50req/hour'),
  careerCoachingController.getCareerAdvice
);

module.exports = router;
