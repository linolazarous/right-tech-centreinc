import careerCoachingService from '../services/careerCoachingService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const getCareerAdvice = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate user ID
        if (!isValidObjectId(userId)) {
            logger.warn(`Invalid user ID format: ${userId}`);
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const { type = 'general' } = req.query;
        const validTypes = ['general', 'technical', 'leadership', 'industry'];
        
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid advice type' });
        }

        logger.info(`Fetching career advice for user: ${userId}, type: ${type}`);
        const advice = await careerCoachingService.getCareerAdvice(userId, type);

        if (!advice || advice.length === 0) {
            logger.info(`No career advice found for user: ${userId}`);
            return res.status(404).json({ message: 'No career advice available' });
        }

        logger.info(`Successfully retrieved career advice for user: ${userId}`);
        res.status(200).json({
            userId,
            type,
            advice,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Error getting career advice: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to get career advice',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    getCareerAdvice
};
