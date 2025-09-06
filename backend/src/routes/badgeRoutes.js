import express from 'express';
const router = express.Router();
import BadgeController from '../controllers/badgeController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateBadgeAssignment } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

// Get all badges
router.get(
  '/badges',
  rateLimit('1000req/hour'),
  BadgeController.getAllBadges
);

// Assign a badge to a user
router.post(
  '/badges/assign',
  authMiddleware,
  validateBadgeAssignment,
  rateLimit('100req/day'),
  BadgeController.assignBadgeToUser
);

export default router;
