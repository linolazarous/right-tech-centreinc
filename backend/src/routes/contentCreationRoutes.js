const express = require('express');
const router = express.Router();
const { createCourseContent } = require('../controllers/contentCreationController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateContentCreation } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/create',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateContentCreation,
  rateLimit('20req/day'),
  createCourseContent
);

module.exports = router;
