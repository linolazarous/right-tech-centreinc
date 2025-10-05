// src/controllers/AccessibilitySettingController.js
import AccessibilitySetting from '../models/AccessibilitySettingModel.js';
import { logger } from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

class AccessibilitySettingController {
  static async getSettings(req, res) {
    try {
      const { userId } = req.params;

      if (!userId || !isValidObjectId(userId)) {
        logger.warn(`Invalid userId format: ${userId}`);
        return res.status(400).json({ success: false, message: 'Invalid user ID format' });
      }

      const settings = await AccessibilitySetting.findOne({ userId }).lean();
      if (!settings) {
        logger.info(`Accessibility settings not found for userId: ${userId}`);
        return res.status(404).json({ success: false, message: 'Accessibility settings not found' });
      }

      logger.info(`Retrieved accessibility settings for userId: ${userId}`);
      return res.status(200).json({ success: true, data: settings });
    } catch (err) {
      logger.error('Error getting accessibility settings', { message: err.message, stack: err.stack });
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async updateSettings(req, res) {
    try {
      const { userId } = req.params;
      const { highContrastMode, fontSize, screenReaderEnabled } = req.body;

      if (!userId || !isValidObjectId(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID format' });
      }

      if (fontSize != null && (typeof fontSize !== 'number' || fontSize < 12 || fontSize > 48)) {
        return res.status(400).json({ success: false, message: 'Font size must be a number between 12 and 48' });
      }

      const update = {
        ...(highContrastMode != null && { highContrastMode: !!highContrastMode }),
        ...(fontSize != null && { fontSize }),
        ...(screenReaderEnabled != null && { screenReaderEnabled: !!screenReaderEnabled })
      };

      const updatedSettings = await AccessibilitySetting.findOneAndUpdate(
        { userId },
        update,
        { new: true, upsert: true, runValidators: true }
      ).lean();

      logger.info(`Accessibility settings updated for userId: ${userId}`);
      return res.status(200).json({ success: true, data: updatedSettings });
    } catch (err) {
      logger.error('Error updating accessibility settings', { message: err.message, stack: err.stack });
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default AccessibilitySettingController;
