import AccessibilitySetting from '../models/accessibilitySettingModel.js';
import logger from '../utils/logger.js';

class AccessibilitySettingService {
  /**
   * Get accessibility settings for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User's accessibility settings
   */
  static async getSettings(userId) {
    try {
      const settings = await AccessibilitySetting.findOne({ userId });
      if (!settings) {
        logger.info(`No settings found for user ${userId}, creating defaults`);
        return this.updateSettings(userId, {
          highContrastMode: false,
          fontSize: 16,
          screenReaderEnabled: false
        });
      }
      return settings;
    } catch (error) {
      logger.error(`Error getting settings for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update accessibility settings for a user
   * @param {string} userId - User ID
   * @param {Object} settings - New settings
   * @returns {Promise<Object>} Updated settings
   */
  static async updateSettings(userId, settings) {
    try {
      const validSettings = {
        highContrastMode: Boolean(settings.highContrastMode),
        fontSize: Math.min(Math.max(parseInt(settings.fontSize) || 16, 24),
        screenReaderEnabled: Boolean(settings.screenReaderEnabled)
      };

      const updatedSettings = await AccessibilitySetting.findOneAndUpdate(
        { userId },
        validSettings,
        { new: true, upsert: true, runValidators: true }
      );

      logger.info(`Settings updated for user ${userId}`);
      return updatedSettings;
    } catch (error) {
      logger.error(`Error updating settings for user ${userId}: ${error.message}`);
      throw error;
    }
  }
}

export default AccessibilitySettingService;
