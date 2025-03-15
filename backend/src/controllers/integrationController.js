const integrationService = require('../services/integrationService');

  exports.integrateGoogleWorkspace = async (req, res) => {
      try {
          const { userId } = req.body;
          const result = await integrationService.integrateGoogleWorkspace(userId);
          res.status(200).json(result);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };