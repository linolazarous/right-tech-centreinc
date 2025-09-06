import express from 'express';
const router = express.Router();
import codingChallengeController from '../controllers/codingChallengeController.js';
import { validateChallengeQuery } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/challenges',
  validateChallengeQuery,
  rateLimit('1000req/hour'),
  codingChallengeController.getCodingChallenges
);

export default router;
