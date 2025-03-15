const careerCoachingService = require('../services/careerCoachingService');

  exports.getCareerAdvice = async (req, res) => {
      try {
          const { userId } = req.params;
          const advice = await careerCoachingService.getCareerAdvice(userId);
          res.status(200).json(advice);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };