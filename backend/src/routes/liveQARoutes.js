const express = require('express');
const router = express.Router();
const liveQAController = require('../controllers/liveQAController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateLiveQA } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/schedule',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateLiveQA,
  rateLimit('10req/day'),
  liveQAController.scheduleLiveQA
);

module.exports = router;
