const LeaderboardService = require('../services/leaderboardService');
const logger = require('../utils/logger');

class LeaderboardController {
    static async getLeaderboard(req, res) {
        try {
            const { type = 'weekly', limit = 20 } = req.query;
            
            // Validate inputs
            if (!['daily', 'weekly', 'monthly', 'alltime'].includes(type)) {
                return res.status(400).json({ error: 'Invalid leaderboard type' });
            }

            if (isNaN(limit) || limit < 1 || limit > 100) {
                return res.status(400).json({ error: 'Limit must be between 1-100' });
            }

            logger.info(`Fetching ${type} leaderboard`);
            const leaderboard = await LeaderboardService.getLeaderboard(
                type, 
                parseInt(limit)
            );

            res.status(200).json({
                type,
                count: leaderboard.length,
                leaderboard,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            logger.error(`Leaderboard error: ${error.message}`, { stack: error.stack });
            res.status(500).json({ 
                error: 'Failed to get leaderboard',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = LeaderboardController;
