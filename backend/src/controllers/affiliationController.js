// src/controllers/affiliationController.js
import AffiliationService from '../services/affiliationService.js';
import { logger } from '../utils/logger.js';
import { validateAffiliationData } from '../validators/affiliationValidator.js';

class AffiliationController {
  static async getAffiliations(req, res) {
    try {
      const page = Math.max(parseInt(req.query.page || '1', 10), 1);
      const limit = Math.max(parseInt(req.query.limit || '10', 10), 1);

      const { data, total } = await AffiliationService.getAffiliations({ page, limit });
      logger.info(`Retrieved affiliations (page=${page}, limit=${limit})`);

      return res.status(200).json({
        success: true,
        data,
        meta: { page, limit, total }
      });
    } catch (err) {
      logger.error('Error getting affiliations', { message: err.message, stack: err.stack });
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async addAffiliation(req, res) {
    try {
      const affiliationData = req.body;
      const error = validateAffiliationData(affiliationData);
      if (error) {
        logger.warn('Affiliation validation failed', { error });
        return res.status(400).json({ success: false, message: error });
      }

      const newAffiliation = await AffiliationService.addAffiliation(affiliationData);
      logger.info('Affiliation created', { id: newAffiliation._id });

      return res.status(201).json({ success: true, data: newAffiliation });
    } catch (err) {
      logger.error('Error adding affiliation', { message: err.message, stack: err.stack });
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default AffiliationController;
