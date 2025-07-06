const express = require('express');
const router = express.Router();
const careerPathController = require('../controllers/careerPathController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUserIdParam } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/recommend/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('50req/hour'),
  careerPathController.recommendCareerPath
);

module.exports = router;
