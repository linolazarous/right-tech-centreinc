const liveQAService = require('../services/liveQAService');

  exports.scheduleLiveQA = async (req, res) => {
      try {
          const session = await liveQAService.scheduleLiveQA(req.body);
          res.status(201).json(session);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };