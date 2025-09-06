import express from 'express';
const router = express.Router();
import liveQAController from '../controllers/liveQAController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateLiveQA } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/schedule',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateLiveQA,
  rateLimit('10req/day'),
  liveQAController.scheduleLiveQA
);

export default router;
