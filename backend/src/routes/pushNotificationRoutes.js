const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/pushNotificationController');

// Send a push notification
router.post('/send', notificationController.sendNotification);

module.exports = router;