const express = require('express');
const router = express.Router();
const { 
  getJobMatches, 
  createResume, 
  getInterviewQuestions, 
  conductMockInterview 
} = require('../controllers/careerController');
const authMiddleware = require('../middleware/authMiddleware');
const { 
  validateJobMatchRequest,
  validateResumeRequest,
  validateInterviewRequest
} = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/job-matches',
  authMiddleware,
  validateJobMatchRequest,
  rateLimit('30req/hour'),
  getJobMatches
);

router.post(
  '/create-resume',
  authMiddleware,
  validateResumeRequest,
  rateLimit('10req/day'),
  createResume
);

router.post(
  '/interview-questions',
  authMiddleware,
  validateInterviewRequest,
  rateLimit('20req/hour'),
  getInterviewQuestions
);

router.post(
  '/mock-interview',
  authMiddleware,
  validateInterviewRequest,
  rateLimit('10req/hour'),
  conductMockInterview
);

module.exports = router;
