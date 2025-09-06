import express from 'express';
const router = express.Router();
import { askTutor } from '../controllers/virtualTutorController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateTutorQuestion } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/ask',
  authMiddleware,
  validateTutorQuestion,
  rateLimit('20req/hour'),
  askTutor
);

export default router;
