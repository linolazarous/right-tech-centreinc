const virtualLabService = require('../services/virtualLabService');

  exports.getVirtualLabs = async (req, res) => {
      try {
          const labs = await virtualLabService.getVirtualLabs();
          res.status(200).json(labs);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };