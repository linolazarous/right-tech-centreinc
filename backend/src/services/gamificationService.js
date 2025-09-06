import User from '../models/User.js';
import Badge from '../models/Badge.js';
import logger from '../utils/logger.js';
import { validateBadgeAward } from '../validators/gamificationValidator.js';

/**
 * Award badge to user
 * @param {string} userId - User ID
 * @param {string} badgeId - Badge ID
 * @returns {Promise<Object>} Award result
 */
export const awardBadge = async (userId, badgeId) => {
  try {
    const validation = validateBadgeAward({ userId, badgeId });
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info(`Awarding badge ${badgeId} to user ${userId}`);
    
    // Check if user already has the badge
    const user = await User.findById(userId);
    if (user.badges.includes(badgeId)) {
      throw new Error('User already has this badge');
    }

    // Verify badge exists
    const badge = await Badge.findById(badgeId);
    if (!badge) {
      throw new Error('Badge not found');
    }

    // Award badge
    user.badges.push(badgeId);
    user.points += badge.pointsValue || 10;
    await user.save();

    logger.info(`Badge ${badgeId} awarded to user ${userId}`);
    return {
      success: true,
      userId: user._id,
      badgeId: badge._id,
      badgeName: badge.name,
      pointsEarned: badge.pointsValue || 10,
      totalPoints: user.points
    };
  } catch (error) {
    logger.error(`Badge award failed: ${error.message}`);
    throw error;
  }
};
