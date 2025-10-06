import gamificationService from '../services/gamificationService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const awardBadge = async (req, res) => {
  try {
    const { userId, badgeId, reason } = req.body;

    if (!isValidObjectId(userId) || !isValidObjectId(badgeId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID or badge ID format' });
    }

    if (!reason || typeof reason !== 'string' || reason.length < 5) {
      return res.status(400).json({ success: false, error: 'Reason must be at least 5 characters' });
    }

    logger.info(`Awarding badge ${badgeId} to user ${userId}`);
    const result = await gamificationService.awardBadge(userId, badgeId, reason);

    if (!result.success) {
      logger.warn(`Badge award failed: ${result.message}`);
      return res.status(400).json({ success: false, ...result });
    }

    res.status(200).json({
      success: true,
      data: {
        userId,
        badgeId,
        badgeName: result.badgeName,
        pointsEarned: result.pointsEarned,
        awardedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error(`Error awarding badge: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      error: 'Failed to award badge',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default { awardBadge };
