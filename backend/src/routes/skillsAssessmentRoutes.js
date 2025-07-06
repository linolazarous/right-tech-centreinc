const express = require('express');
const router = express.Router();
const skillAssessmentController = require('../controllers/skillAssessmentController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateSkillAssessment } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.post(
  '/assess',
  authMiddleware,
  validateSkillAssessment,
  rateLimit('30req/hour'),
  skillAssessmentController.assessSkill
);

module.exports = router;
