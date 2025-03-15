const express = require('express');
const router = express.Router();
const LeaderboardController = require('../controllers/leaderboardController');

// Get the leaderboard
router.get('/leaderboard', LeaderboardController.getLeaderboard);

module.exports = router;