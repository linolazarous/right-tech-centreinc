const VirtualLab = require('../models/VirtualLab');
const logger = require('../utils/logger');

class VirtualLabService {
  static async getVirtualLabs(filters = {}) {
    try {
      const query = { isActive: true };
      if (filters.subject) query.subject = filters.subject;

      const labs = await VirtualLab.find(query)
        .sort({ title: 1 })
        .lean();

      logger.info(`Retrieved ${labs.length} virtual labs`);
      return labs;
    } catch (error) {
      logger.error(`Failed to fetch virtual labs: ${error.message}`);
      throw new Error('Failed to retrieve virtual labs');
    }
  }
}

module.exports = VirtualLabService;
