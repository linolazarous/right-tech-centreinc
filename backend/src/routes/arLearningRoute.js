const express = require('express');
const router = express.Router();
const { createLesson } = require('../controllers/arLearningController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateARContent } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/create',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateARContent,
  rateLimit('20req/day'),
  createLesson
);

module.exports = router;
