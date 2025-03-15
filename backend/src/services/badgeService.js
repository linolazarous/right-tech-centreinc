const BadgeModel = require('../models/badgeModel');

class BadgeService {
  static async getAllBadges() {
    return await BadgeModel.find();
  }

  static async assignBadgeToUser(userId, badgeId) {
    // Logic to assign a badge to a user
    const user = await UserModel.findById(userId);
    user.badges.push(badgeId);
    await user.save();
    return user;
  }
}

module.exports = BadgeService;