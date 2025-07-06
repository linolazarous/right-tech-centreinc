const express = require('express');
const router = express.Router();
const { askTutor } = require('../controllers/virtualTutorController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateTutorQuestion } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/ask',
  authMiddleware,
  validateTutorQuestion,
  rateLimit('20req/hour'),
  askTutor
);

module.exports = router;
