const express = require('express');
const router = express.Router();
const LeaderboardController = require('../controllers/leaderboardController');
const { validateLeaderboardQuery } = require('../middleware/validationMiddleware');
const rateLimit = require('../middleware/rateLimitMiddleware');

router.get(
  '/leaderboard',
  validateLeaderboardQuery,
  rateLimit('1000req/hour'),
  LeaderboardController.getLeaderboard
);

module.exports = router;
