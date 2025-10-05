import express from 'express';
import codingChallengeController from '../controllers/codingChallengeController.js';
import { validateChallengeQuery } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/coding-challenges
 * @desc    Retrieve all coding challenges or filter by difficulty/language
 * @access  Public
 */
router.get(
  '/',
  validateChallengeQuery,
  rateLimit('1000req/hour'),
  codingChallengeController.getCodingChallenges
);

export default router;
