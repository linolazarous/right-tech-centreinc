const AccessibilitySetting = require('../models/accessibilitySettingModel');
const logger = require('../utils/logger'); // Assuming you have a logger utility

class AccessibilitySettingController {
  /**
   * Get accessibility settings for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async getSettings(req, res) {
    try {
      const { userId } = req.params;
      
      // Validate userId
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid user ID',
          details: 'User ID must be a non-empty string'
        });
      }

      const settings = await AccessibilitySetting.findOne({ userId }).lean();

      if (!settings) {
        logger.info(`Accessibility settings not found for user: ${userId}`);
        return res.status(404).json({ 
          message: 'Accessibility settings not found',
          suggestion: 'Create new settings using POST /accessibility'
        });
      }

      // Remove internal MongoDB fields before sending response
      const { _id, __v, ...responseData } = settings;
      
      return res.status(200).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      logger.error(`Error getting accessibility settings: ${error.message}`, {
        stack: error.stack,
        params: req.params
      });
      return res.status(500).json({ 
        error: 'Internal server error',
        requestId: req.id // Assuming you have request ID middleware
      });
    }
  }

  /**
   * Update or create accessibility settings for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async updateSettings(req, res) {
    try {
      const { userId } = req.params;
      const { highContrastMode, fontSize, screenReaderEnabled } = req.body;

      // Input validation
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid user ID',
          details: 'User ID must be a non-empty string'
        });
      }

      if (fontSize && (typeof fontSize !== 'number' || fontSize < 12 || fontSize > 24)) {
        return res.status(400).json({ 
          error: 'Invalid font size',
          details: 'Font size must be between 12 and 24'
        });
      }

      if (typeof highContrastMode !== 'boolean' || typeof screenReaderEnabled !== 'boolean') {
        return res.status(400).json({ 
          error: 'Invalid settings format',
          details: 'Boolean values required for highContrastMode and screenReaderEnabled'
        });
      }

      const updateFields = {
        highContrastMode,
        fontSize,
        screenReaderEnabled,
        lastUpdated: new Date()
      };

      const updatedSettings = await AccessibilitySetting.findOneAndUpdate(
        { userId },
        updateFields,
        { 
          new: true,
          upsert: true,
          runValidators: true, // Ensure model validation runs
          lean: true
        }
      );

      // Remove internal fields before response
      const { _id, __v, ...responseData } = updatedSettings;

      logger.info(`Updated accessibility settings for user: ${userId}`);
      
      return res.status(200).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      logger.error(`Error updating accessibility settings: ${error.message}`, {
        stack: error.stack,
        params: req.params,
        body: req.body
      });

      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          error: 'Validation error',
          details: error.message
        });
      }

      return res.status(500).json({ 
        error: 'Internal server error',
        requestId: req.id
      });
    }
  }
}

module.exports = AccessibilitySettingController;
