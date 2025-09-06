import BadgeModel from '../models/badgeModel.js';
import UserModel from '../models/userModel.js';
import logger from '../utils/logger.js';

class BadgeService {
  /**
   * Get all badges
   * @returns {Promise<Array>} List of badges
   */
  static async getAllBadges() {
    try {
      logger.info('Fetching all badges');
      return await BadgeModel.find()
        .sort({ createdAt: -1 })
        .select('-__v');
    } catch (error) {
      logger.error(`Error fetching badges: ${error.message}`);
      throw error;
    }
  }

  /**
   * Assign badge to user
   * @param {string} userId - User ID
   * @param {string} badgeId - Badge ID
   * @returns {Promise<Object>} Updated user
   */
  static async assignBadgeToUser(userId, badgeId) {
    try {
      // Check if user already has the badge
      const user = await UserModel.findById(userId);
      if (user.badges.includes(badgeId)) {
        throw new Error('User already has this badge');
      }

      // Verify badge exists
      const badge = await BadgeModel.findById(badgeId);
      if (!badge) {
        throw new Error('Badge not found');
      }

      // Assign badge
      user.badges.push(badgeId);
      await user.save();

      logger.info(`Badge ${badgeId} assigned to user ${userId}`);
      return {
        success: true,
        user: user.toObject({ virtuals: true }),
        badge: badge.toObject({ virtuals: true })
      };
    } catch (error) {
      logger.error(`Error assigning badge ${badgeId} to user ${userId}: ${error.message}`);
      throw error;
    }
  }
}

export default BadgeService;
