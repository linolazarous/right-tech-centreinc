const UserModel = require('../models/userModel');

class LeaderboardService {
  static async getLeaderboard() {
    // Fetch users sorted by points or another metric
    const leaderboard = await UserModel.find().sort({ points: -1 }).limit(10);
    return leaderboard;
  }
}

module.exports = LeaderboardService;