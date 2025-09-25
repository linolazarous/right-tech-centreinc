import UserModel from '../models/user.js';
import logger from '../utils/logger.js';

class UserService {
  static async getUserProfile(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = await UserModel.findById(userId)
        .select('-password -__v')
        .lean();

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error(`Failed to fetch user profile: ${error.message}`);
      throw new Error('Failed to retrieve user profile');
    }
  }

  static async updateUserProfile(userId, updatedData) {
    try {
      if (!userId || !updatedData) {
        throw new Error('User ID and update data are required');
      }

      // Filter updatable fields
      const allowedUpdates = {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        bio: updatedData.bio,
        avatar: updatedData.avatar
      };

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        allowedUpdates,
        { new: true, runValidators: true }
      ).select('-password -__v');

      if (!updatedUser) {
        throw new Error('User not found');
      }

      logger.info(`User profile updated for ${userId}`);
      return updatedUser;
    } catch (error) {
      logger.error(`Profile update failed: ${error.message}`);
      throw new Error('Failed to update user profile');
    }
  }
}

export default UserService;

