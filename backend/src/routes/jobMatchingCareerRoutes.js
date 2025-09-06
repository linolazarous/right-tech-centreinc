import express from 'express';
const router = express.Router();
import { 
  getJobMatches, 
  createResume, 
  getInterviewQuestions, 
  conductMockInterview 
} from '../controllers/careerController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { 
  validateJobMatchRequest,
  validateResumeRequest,
  validateInterviewRequest
} from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

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

export default router;
