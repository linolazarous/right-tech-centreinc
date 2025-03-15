const gamificationService = require('../services/gamificationService');

  exports.awardBadge = async (req, res) => {
      try {
          const { userId, badge } = req.body;
          const result = await gamificationService.awardBadge(userId, badge);
          res.status(200).json(result);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };