const express = require('express');
const router = express.Router();
const resumeBuilderController = require('../controllers/resumeBuilderController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUserIdParam } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/generate/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('5req/day'),
  resumeBuilderController.generateResume
);

module.exports = router;
