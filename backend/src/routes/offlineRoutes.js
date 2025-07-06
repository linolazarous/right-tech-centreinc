const express = require('express');
const router = express.Router();
const offlineController = require('../controllers/offlineController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateCourseId } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/download-course/:courseId',
  authMiddleware,
  validateCourseId,
  rateLimit('10req/day'),
  offlineController.downloadCourse
);

module.exports = router;
