import PrivacyModel from '../models/privacyModel.js';
import logger from '../utils/logger.js';

class PrivacyService {
  static async updatePrivacySettings(userId, privacyData) {
    try {
      if (!userId || !privacyData) {
        throw new Error('Invalid input parameters');
      }

      const validSettings = {
        profileVisibility: privacyData.profileVisibility || 'private',
        dataSharing: privacyData.dataSharing || false,
        communicationPrefs: privacyData.communicationPrefs || []
      };

      const updatedSettings = await PrivacyModel.findOneAndUpdate(
        { userId },
        validSettings,
        { new: true, upsert: true }
      );

      logger.info(`Privacy settings updated for user ${userId}`);
      return updatedSettings;
    } catch (error) {
      logger.error(`Privacy settings update failed: ${error.message}`);
      throw new Error('Failed to update privacy settings');
    }
  }

  static async getPrivacySettings(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const settings = await PrivacyModel.findOne({ userId }).lean();
      return settings || {
        profileVisibility: 'private',
        dataSharing: false,
        communicationPrefs: []
      };
    } catch (error) {
      logger.error(`Failed to fetch privacy settings: ${error.message}`);
      throw new Error('Failed to retrieve privacy settings');
    }
  }
}

export default PrivacyService;
