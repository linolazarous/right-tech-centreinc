const express = require('express');
const router = express.Router();
const { createLesson } = require('../controllers/vrLearningController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateVRLesson } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/create',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateVRLesson,
  rateLimit('10req/day'),
  createLesson
);

module.exports = router;
