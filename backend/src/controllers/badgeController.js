import BadgeService from '../services/badgeService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

class BadgeController {
    static async getAllBadges(req, res) {
        try {
            const { category, limit = 50 } = req.query;
            
            // Validate inputs
            if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
                return res.status(400).json({ error: 'Limit must be between 1 and 100' });
            }

            const badges = await BadgeService.getAllBadges({ category, limit });
            
            logger.info(`Retrieved ${badges.length} badges`);
            res.status(200).json({
                count: badges.length,
                badges
            });
        } catch (error) {
            logger.error(`Error getting badges: ${error.message}`, { stack: error.stack });
            res.status(500).json({ 
                error: 'Failed to retrieve badges',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    static async assignBadgeToUser(req, res) {
        try {
            const { userId, badgeId } = req.body;
            
            // Validate inputs
            if (!isValidObjectId(userId) || !isValidObjectId(badgeId)) {
                return res.status(400).json({ error: 'Invalid user ID or badge ID format' });
            }

            const result = await BadgeService.assignBadgeToUser(userId, badgeId);
            
            if (!result.success) {
                logger.warn(`Badge assignment failed: ${result.message}`);
                return res.status(400).json(result);
            }

            logger.info(`Badge ${badgeId} assigned to user ${userId}`);
            res.status(200).json({
                success: true,
                badge: result.badge,
                user: result.user
            });
        } catch (error) {
            logger.error(`Error assigning badge: ${error.message}`, { stack: error.stack });
            res.status(500).json({ 
                error: 'Failed to assign badge',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

export default BadgeController;
