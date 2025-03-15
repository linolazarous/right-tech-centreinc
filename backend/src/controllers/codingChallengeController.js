const codingChallengeService = require('../services/codingChallengeService');

  exports.getCodingChallenges = async (req, res) => {
      try {
          const challenges = await codingChallengeService.getCodingChallenges();
          res.status(200).json(challenges);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };