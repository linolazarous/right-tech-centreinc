import express from 'express';
import BadgeController from '../controllers/badgeController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateBadgeAssignment } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/badges
 * @desc    Retrieve all badges
 * @access  Public
 */
router.get('/', rateLimit('1000req/hour'), BadgeController.getAllBadges);

/**
 * @route   POST /api/badges/assign
 * @desc    Assign a badge to a user
 * @access  Authenticated
 */
router.post(
  '/assign',
  authMiddleware,
  validateBadgeAssignment,
  rateLimit('100req/day'),
  BadgeController.assignBadgeToUser
);

export default router;
