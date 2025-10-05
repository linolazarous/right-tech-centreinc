import express from 'express';
import gamificationController from '../controllers/gamificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateBadgeAward } from '../middleware/validationMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/gamification/award
 * @desc    Award a gamification badge to a user
 * @access  Instructor, Admin
 */
router.post(
  '/award',
  authMiddleware,
  roleMiddleware(['instructor', 'admin']),
  validateBadgeAward,
  rateLimit('100req/day'),
  gamificationController.awardBadge
);

export default router;
