const express = require('express');
const router = express.Router();
const zoomController = require('../controllers/zoomController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateZoomMeeting } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/schedule-meeting',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateZoomMeeting,
  rateLimit('10req/day'),
  zoomController.scheduleMeeting
);

module.exports = router;
