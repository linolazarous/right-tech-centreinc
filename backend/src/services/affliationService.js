const AffiliationModel = require('../models/affiliationModel');

class AffiliationService {
  static async getAffiliations() {
    return await AffiliationModel.find();
  }

  static async addAffiliation(affiliationData) {
    const newAffiliation = new AffiliationModel(affiliationData);
    return await newAffiliation.save();
  }
}

module.exports = AffiliationService;