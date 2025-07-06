const AffiliationModel = require('../models/affiliationModel');
const logger = require('../utils/logger');

class AffiliationService {
  /**
   * Get all affiliations
   * @returns {Promise<Array>} List of affiliations
   */
  static async getAffiliations() {
    try {
      logger.info('Fetching all affiliations');
      return await AffiliationModel.find().sort({ name: 1 });
    } catch (error) {
      logger.error(`Error fetching affiliations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add a new affiliation
   * @param {Object} affiliationData - Affiliation data
   * @returns {Promise<Object>} Created affiliation
   */
  static async addAffiliation(affiliationData) {
    try {
      logger.info('Creating new affiliation');
      const newAffiliation = new AffiliationModel(affiliationData);
      await newAffiliation.validate();
      await newAffiliation.save();
      logger.info(`Affiliation created: ${newAffiliation._id}`);
      return newAffiliation;
    } catch (error) {
      logger.error(`Error creating affiliation: ${error.message}`);
      if (error.code === 11000) {
        throw new Error('Affiliation with this name already exists');
      }
      throw error;
    }
  }
}

module.exports = AffiliationService;
