const gamificationService = require('../services/gamificationService');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

exports.awardBadge = async (req, res) => {
    try {
        const { userId, badgeId, reason } = req.body;
        
        // Validate inputs
        if (!isValidObjectId(userId) || !isValidObjectId(badgeId)) {
            return res.status(400).json({ error: 'Invalid user ID or badge ID format' });
        }

        if (!reason || typeof reason !== 'string' || reason.length < 5) {
            return res.status(400).json({ error: 'Reason must be at least 5 characters' });
        }

        logger.info(`Awarding badge ${badgeId} to user ${userId}`);
        const result = await gamificationService.awardBadge(userId, badgeId, reason);

        if (!result.success) {
            logger.warn(`Badge award failed: ${result.message}`);
            return res.status(400).json(result);
        }

        logger.info(`Badge ${badgeId} successfully awarded to user ${userId}`);
        res.status(200).json({
            success: true,
            userId,
            badgeId,
            badgeName: result.badgeName,
            awardedAt: new Date().toISOString(),
            pointsEarned: result.pointsEarned
        });
    } catch (error) {
        logger.error(`Error awarding badge: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to award badge',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
