const UserModel = require('../models/userModel');

class UserService {
  static async getUserProfile(userId) {
    return await UserModel.findById(userId);
  }

  static async updateUserProfile(userId, updatedData) {
    return await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });
  }
}

module.exports = UserService;