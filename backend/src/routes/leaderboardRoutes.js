import express from 'express';
const router = express.Router();
import LeaderboardController from '../controllers/leaderboardController.js';
import { validateLeaderboardQuery } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

router.get(
  '/leaderboard',
  validateLeaderboardQuery,
  rateLimit('1000req/hour'),
  LeaderboardController.getLeaderboard
);

export default router;
