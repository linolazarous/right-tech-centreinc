const LeaderboardService = require('../services/leaderboardService');

class LeaderboardController {
  static async getLeaderboard(req, res) {
    try {
      const leaderboard = await LeaderboardService.getLeaderboard();
      res.status(200).json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LeaderboardController;