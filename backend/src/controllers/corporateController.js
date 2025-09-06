import corporateTrainingService from '../services/corporateTrainingService.js';
import logger from '../utils/logger.js';
import { validateTrainingRequest } from '../validators/trainingValidator.js';

export const createTraining = async (req, res) => {
    try {
        const trainingData = req.body;
        
        // Validate input
        const validation = validateTrainingRequest(trainingData);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        logger.info('Creating corporate training', { company: trainingData.companyName });
        const training = await corporateTrainingService.createTraining(trainingData);

        logger.info(`Corporate training created: ${training._id}`);
        res.status(201).json({
            trainingId: training._id,
            company: training.companyName,
            startDate: training.startDate,
            status: training.status,
            contactEmail: training.contactEmail
        });
    } catch (error) {
        logger.error(`Error creating corporate training: ${error.message}`, { stack: error.stack });
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to create corporate training',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    createTraining
};
