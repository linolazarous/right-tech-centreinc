const express = require('express');
const router = express.Router();
const learningPathController = require('../controllers/learningPathController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUserIdParam } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/learning-path/:userId',
  authMiddleware,
  validateUserIdParam,
  rateLimit('50req/hour'),
  learningPathController.getLearningPath
);

module.exports = router;
