const UserService = require('../services/userService');

class UserController {
  static async getUserProfile(req, res) {
    try {
      const { userId } = req.params;
      const user = await UserService.getUserProfile(userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUserProfile(req, res) {
    try {
      const { userId } = req.params;
      const updatedData = req.body;
      const result = await UserService.updateUserProfile(userId, updatedData);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;