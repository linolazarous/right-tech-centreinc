const express = require('express');
const router = express.Router();
const arvrController = require('../controllers/arvrController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateARVRContent } = require('../middleware/validationMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

// Generate AR/VR content for a course
router.post(
  '/generate',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateARVRContent,
  rateLimit('10req/day'),
  arvrController.generateARVRContent
);

module.exports = router;
