const PrivacyModel = require('../models/privacyModel');

class PrivacyService {
  static async updatePrivacySettings(userId, privacyData) {
    return await PrivacyModel.findOneAndUpdate({ userId }, privacyData, { new: true });
  }

  static async getPrivacySettings(userId) {
    return await PrivacyModel.findOne({ userId });
  }
}

module.exports = PrivacyService;