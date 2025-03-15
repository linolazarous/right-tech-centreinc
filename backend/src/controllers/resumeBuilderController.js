const resumeBuilderService = require('../services/resumeBuilderService');

  exports.generateResume = async (req, res) => {
      try {
          const { userId } = req.params;
          const resume = await resumeBuilderService.generateResume(userId);
          res.status(200).json(resume);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };