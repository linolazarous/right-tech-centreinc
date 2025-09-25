import User from '../models/User.js';

class UserService {
  static async getUserProfile(userId) {
    try {
      return await User.findById(userId).select('-password -twoFASecret');
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  static async updateUserProfile(userId, updatedData) {
    try {
      // Remove fields that shouldn't be updated directly
      const { password, twoFASecret, ...safeData } = updatedData;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: safeData },
        { new: true, runValidators: true }
      ).select('-password -twoFASecret');

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      return {
        success: true,
        user,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  }

  static async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      return { success: !!user, message: user ? 'User deleted' : 'User not found' };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}

export default UserService;
