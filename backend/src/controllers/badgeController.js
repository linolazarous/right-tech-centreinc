import BadgeService from '../services/badgeService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

class BadgeController {
    static async getAllBadges(req, res) {
        try {
            const { category, limit = 50 } = req.query;

            const parsedLimit = parseInt(limit, 10);
            if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
                return res.status(400).json({ success: false, error: 'Limit must be a number between 1 and 100' });
            }

            const badges = await BadgeService.getAllBadges({ category, limit: parsedLimit });

            logger.info(`✅ Retrieved ${badges.length} badges${category ? ` for category ${category}` : ''}`);
            return res.status(200).json({
                success: true,
                count: badges.length,
                badges
            });
        } catch (error) {
            logger.error(`❌ Error retrieving badges: ${error.message}`, { stack: error.stack });
            return res.status(500).json({
                success: false,
                error: 'Failed to retrieve badges',
                ...(process.env.NODE_ENV === 'development' && { details: error.message })
            });
        }
    }

    static async assignBadgeToUser(req, res) {
        try {
            const { userId, badgeId } = req.body;

            if (!isValidObjectId(userId) || !isValidObjectId(badgeId)) {
                return res.status(400).json({ success: false, error: 'Invalid user ID or badge ID format' });
            }

            const result = await BadgeService.assignBadgeToUser(userId, badgeId);

            if (!result.success) {
                logger.warn(`⚠️ Badge assignment failed: ${result.message}`);
                return res.status(400).json(result);
            }

            logger.info(`🏅 Badge ${badgeId} successfully assigned to user ${userId}`);
            return res.status(200).json({
                success: true,
                message: 'Badge successfully assigned',
                badge: result.badge,
                user: result.user
            });
        } catch (error) {
            logger.error(`❌ Error assigning badge: ${error.message}`, { stack: error.stack });
            return res.status(500).json({
                success: false,
                error: 'Failed to assign badge',
                ...(process.env.NODE_ENV === 'development' && { details: error.message })
            });
        }
    }
}

export default BadgeController;
