const express = require('express');
const router = express.Router();
const { createLesson, getAllLessons } = require('../controllers/microLearningController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateMicroLesson } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateMicroLesson,
  rateLimit('20req/day'),
  createLesson
);

router.get(
  '/',
  rateLimit('1000req/hour'),
  getAllLessons
);

module.exports = router;
