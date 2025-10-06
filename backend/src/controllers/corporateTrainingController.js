import CorporateTrainingModel from '../models/corporateTrainingModel.js';
import logger from '../utils/logger.js';

export const createCorporateTraining = async (req, res) => {
  try {
    const trainingData = req.body;

    if (trainingData.startDate && isNaN(Date.parse(trainingData.startDate))) {
      return res.status(400).json({ success: false, error: 'Invalid start date format.' });
    }

    const training = await CorporateTrainingModel.create(trainingData);
    logger.info(`Corporate training created: ${training.title}`);

    res.status(201).json({ success: true, data: training });
  } catch (error) {
    logger.error(`Error creating corporate training: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to create corporate training.' });
  }
};
