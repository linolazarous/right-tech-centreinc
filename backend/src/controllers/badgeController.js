const BadgeService = require('../services/badgeService');

class BadgeController {
  static async getAllBadges(req, res) {
    try {
      const badges = await BadgeService.getAllBadges();
      res.status(200).json(badges);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async assignBadgeToUser(req, res) {
    try {
      const { userId, badgeId } = req.body;
      const result = await BadgeService.assignBadgeToUser(userId, badgeId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = BadgeController;