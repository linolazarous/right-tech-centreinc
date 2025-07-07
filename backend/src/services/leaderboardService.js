const UserModel = require('../models/userModel');
const logger = require('../utils/logger');

class LeaderboardService {
  /**
   * Get leaderboard with optional filters
   * @param {string} type - Time period (weekly, monthly, alltime)
   * @param {number} limit - Number of results
   * @returns {Promise<Array>} Leaderboard data
   */
  static async getLeaderboard(type = 'weekly', limit = 10) {
    try {
      const validTypes = ['weekly', 'monthly', 'alltime'];
      if (!validTypes.includes(type)) {
        throw new Error('Invalid leaderboard type');
      }

      logger.info(`Fetching ${type} leaderboard`);
      
      // Calculate date range based on type
      let dateFilter = {};
      if (type === 'weekly') {
        dateFilter = { lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
      } else if (type === 'monthly') {
        dateFilter = { lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
      }

      const leaderboard = await UserModel.find(dateFilter)
        .sort({ points: -1 })
        .limit(parseInt(limit))
        .select('name avatar points badges');

      return leaderboard.map(user => ({
        userId: user._id,
        name: user.name,
        avatar: user.avatar,
        points: user.points,
        badgeCount: user.badges.length
      }));
    } catch (error) {
      logger.error(`Leaderboard fetch failed: ${error.message}`);
      throw error;
    }
  }
}

module.exports = LeaderboardService;
