const VRLab = require('../models/VRLab');
const logger = require('../utils/logger');

class VRLabService {
  static async getVRLabs(filters = {}) {
    try {
      const query = { isActive: true };
      if (filters.discipline) query.discipline = filters.discipline;

      const labs = await VRLab.find(query)
        .sort({ title: 1 })
        .lean();

      logger.info(`Retrieved ${labs.length} VR labs`);
      return labs;
    } catch (error) {
      logger.error(`Failed to fetch VR labs: ${error.message}`);
      throw new Error('Failed to retrieve VR labs');
    }
  }
}

module.exports = VRLabService;
