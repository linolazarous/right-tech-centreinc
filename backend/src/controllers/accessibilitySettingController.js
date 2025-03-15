const AccessibilitySetting = require('../models/accessibilitySettingModel');

class AccessibilitySettingController {
  // Get accessibility settings for a user
  static async getSettings(req, res) {
    try {
      const { userId } = req.params;
      const settings = await AccessibilitySetting.findOne({ userId });
      if (!settings) {
        return res.status(404).json({ message: 'Accessibility settings not found' });
      }
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update accessibility settings for a user
  static async updateSettings(req, res) {
    try {
      const { userId } = req.params;
      const { highContrastMode, fontSize, screenReaderEnabled } = req.body;

      const updatedSettings = await AccessibilitySetting.findOneAndUpdate(
        { userId },
        { highContrastMode, fontSize, screenReaderEnabled },
        { new: true, upsert: true } // Create settings if they don't exist
      );

      res.status(200).json(updatedSettings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AccessibilitySettingController;