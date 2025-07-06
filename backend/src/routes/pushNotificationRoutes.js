const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/pushNotificationController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateNotification } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/send',
  authMiddleware,
  validateNotification,
  rateLimit('50req/hour'),
  notificationController.sendNotification
);

module.exports = router;
