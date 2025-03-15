const AffiliationService = require('../services/affiliationService');

class AffiliationController {
  static async getAffiliations(req, res) {
    try {
      const affiliations = await AffiliationService.getAffiliations();
      res.status(200).json(affiliations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addAffiliation(req, res) {
    try {
      const affiliationData = req.body;
      const newAffiliation = await AffiliationService.addAffiliation(affiliationData);
      res.status(201).json(newAffiliation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AffiliationController;