import express from 'express';
const router = express.Router();
import gamificationController from '../controllers/gamificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateBadgeAward } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.post(
  '/award-badge',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateBadgeAward,
  rateLimit('100req/day'),
  gamificationController.awardBadge
);

export default router;
