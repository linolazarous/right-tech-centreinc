const CorporateTraining = require('../models/CorporateTraining');
const logger = require('../utils/logger');
const { validateCorporateTraining } = require('../validators/corporateValidator');

/**
 * Create corporate training program
 * @param {Object} trainingData - Training program data
 * @returns {Promise<Object>} Created training program
 */
exports.createTraining = async (trainingData) => {
  try {
    const validation = validateCorporateTraining(trainingData);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info('Creating corporate training program');
    const training = new CorporateTraining({
      ...trainingData,
      status: 'scheduled',
      createdAt: new Date()
    });

    await training.save();
    
    logger.info(`Corporate training created: ${training._id}`);
    return {
      id: training._id,
      company: training.companyName,
      startDate: training.startDate,
      contactEmail: training.contactEmail,
      status: training.status
    };
  } catch (error) {
    logger.error(`Corporate training creation failed: ${error.message}`);
    
    if (error.code === 11000) {
      throw new Error('Training program with this name already exists');
    }
    
    throw error;
  }
};
