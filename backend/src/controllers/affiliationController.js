const AffiliationService = require('../services/affiliationService');
const logger = require('../utils/logger');
const { validateAffiliationData } = require('../validators/affiliationValidator');

class AffiliationController {
  /**
   * Get all affiliations
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAffiliations(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      // Validate pagination parameters
      if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return res.status(400).json({ message: 'Invalid pagination parameters' });
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const affiliations = await AffiliationService.getAffiliations(options);
      
      logger.info(`Retrieved ${affiliations.length} affiliations`);
      res.status(200).json({
        data: affiliations,
        page: options.page,
        limit: options.limit
      });
    } catch (error) {
      logger.error(`Error getting affiliations: ${error.message}`, { stack: error.stack });
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }

  /**
   * Add a new affiliation
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async addAffiliation(req, res) {
    try {
      const affiliationData = req.body;
      
      // Validate input data
      const validationError = validateAffiliationData(affiliationData);
      if (validationError) {
        logger.warn(`Validation error: ${validationError}`);
        return res.status(400).json({ message: validationError });
      }

      const newAffiliation = await AffiliationService.addAffiliation(affiliationData);
      
      logger.info(`New affiliation added with ID: ${newAffiliation._id}`);
      res.status(201).json(newAffiliation);
    } catch (error) {
      logger.error(`Error adding affiliation: ${error.message}`, { stack: error.stack });
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }
}

module.exports = AffiliationController;
