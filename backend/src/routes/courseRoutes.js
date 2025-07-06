const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateCourseCreation } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/courses',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateCourseCreation,
  rateLimit('20req/day'),
  courseController.createCourse
);

router.get(
  '/courses',
  rateLimit('1000req/hour'),
  courseController.getCourses
);

module.exports = router;
