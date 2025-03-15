const AccessibilitySetting = require('../models/accessibilitySettingModel');

class AccessibilitySettingService {
  // Get accessibility settings for a user
  static async getSettings(userId) {
    return await AccessibilitySetting.findOne({ userId });
  }

  // Update accessibility settings for a user
  static async updateSettings(userId, settings) {
    return await AccessibilitySetting.findOneAndUpdate(
      { userId },
      settings,
      { new: true, upsert: true }
    );
  }
}

module.exports = AccessibilitySettingService;