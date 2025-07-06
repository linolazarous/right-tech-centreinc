const express = require('express');
const router = express.Router();
const { createEvent } = require('../controllers/vrCareerFairController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateVREvent } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/create-event',
  authMiddleware,
  roleMiddleware(['admin', 'career_services']),
  validateVREvent,
  rateLimit('5req/day'),
  createEvent
);

module.exports = router;
