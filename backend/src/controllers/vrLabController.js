const vrLabService = require('../services/vrLabService');

  exports.getVRLabs = async (req, res) => {
      try {
          const labs = await vrLabService.getVRLabs();
          res.status(200).json(labs);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };