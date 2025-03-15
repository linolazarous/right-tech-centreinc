const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/progress/:userId', analyticsController.getStudentProgress);
router.get('/engagement/:userId', analyticsController.getEngagementMetrics);

module.exports = router;