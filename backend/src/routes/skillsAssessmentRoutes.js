import express from 'express';
const router = express.Router();
import skillAssessmentController from '../controllers/skillAssessmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateSkillAssessment } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/assess',
  authMiddleware,
  validateSkillAssessment,
  rateLimit('30req/hour'),
  skillAssessmentController.assessSkill
);

export default router;
