const AccessibilitySetting = require('../models/AccessibilitySettingModel');
const logger = require('../utils/logger');

class AccessibilitySettingController {
  /**
   * Get accessibility settings for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getSettings(req, res) {
    try {
      const { userId } = req.params;
      
      // Input validation
      if (!userId || typeof userId !== 'string') {
        logger.warn(`Invalid userId format: ${userId}`);
        return res.status(400).json({ message: 'Invalid user ID format' });
      }

      const settings = await AccessibilitySetting.findOne({ userId });
      
      if (!settings) {
        logger.info(`Settings not found for userId: ${userId}`);
        return res.status(404).json({ message: 'Accessibility settings not found' });
      }
      
      logger.info(`Successfully retrieved settings for userId: ${userId}`);
      res.status(200).json(settings);
    } catch (error) {
      logger.error(`Error getting settings: ${error.message}`, { stack: error.stack });
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }

  /**
   * Update accessibility settings for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateSettings(req, res) {
    try {
      const { userId } = req.params;
      const { highContrastMode, fontSize, screenReaderEnabled } = req.body;

      // Input validation
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }

      if (fontSize && (typeof fontSize !== 'number' || fontSize < 12 || fontSize > 24)) {
        return res.status(400).json({ message: 'Font size must be between 12 and 24' });
      }

      const updatedSettings = await AccessibilitySetting.findOneAndUpdate(
        { userId },
        { 
          highContrastMode: !!highContrastMode,
          fontSize: fontSize || 16,
          screenReaderEnabled: !!screenReaderEnabled 
        },
        { 
          new: true, 
          upsert: true,
          runValidators: true 
        }
      );

      logger.info(`Settings updated for userId: ${userId}`);
      res.status(200).json(updatedSettings);
    } catch (error) {
      logger.error(`Error updating settings: ${error.message}`, { stack: error.stack });
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }
}

module.exports = AccessibilitySettingController;
