const axios = require('axios');
const logger = require('../utils/logger');
const { validateMetaverseCampus } = require('../validators/metaverseValidator');

/**
 * Create virtual campus in metaverse
 * @param {string} campusName - Campus name
 * @param {string} [template] - Campus template
 * @param {number} [capacity] - User capacity
 * @returns {Promise<Object>} Created campus
 */
const createVirtualCampus = async (campusName, template = 'default', capacity = 100) => {
  try {
    const validation = validateMetaverseCampus({ campusName, template, capacity });
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info(`Creating virtual campus: ${campusName}`);
    
    const response = await axios.post(
      "https://api.metaverseplatform.com/v1/campuses",
      {
        name: campusName,
        template,
        capacity,
        metadata: {
          createdBy: 'system',
          createdAt: new Date().toISOString()
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.METAVERSE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    logger.info(`Virtual campus created: ${response.data.id}`);
    return {
      campusId: response.data.id,
      name: response.data.name,
      template: response.data.template,
      accessUrl: response.data.accessUrl,
      capacity: response.data.capacity,
      createdAt: response.data.metadata.createdAt
    };
  } catch (error) {
    logger.error(`Virtual campus creation failed: ${error.message}`);
    
    if (error.response) {
      // Handle API error response
      throw new Error(`Metaverse platform error: ${error.response.data.message}`);
    }
    
    throw new Error('Failed to create virtual campus');
  }
};

module.exports = { createVirtualCampus };
