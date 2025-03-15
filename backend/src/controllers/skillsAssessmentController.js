const skillAssessmentService = require('../services/skillAssessmentService');

  exports.assessSkill = async (req, res) => {
      try {
          const { userId, skill } = req.body;
          const result = await skillAssessmentService.assessSkill(userId, skill);
          res.status(200).json(result);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };