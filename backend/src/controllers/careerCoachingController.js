import careerCoachingService from '../services/careerCoachingService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const getCareerAdvice = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type = 'general' } = req.query;

        if (!isValidObjectId(userId)) {
            logger.warn(`⚠️ Invalid user ID format: ${userId}`);
            return res.status(400).json({ success: false, error: 'Invalid user ID format' });
        }

        const validTypes = ['general', 'technical', 'leadership', 'industry'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ success: false, error: `Invalid advice type. Must be one of: ${validTypes.join(', ')}` });
        }

        logger.info(`🧠 Fetching career advice for user ${userId} [${type}]`);
        const advice = await careerCoachingService.getCareerAdvice(userId, type);

        if (!advice || advice.length === 0) {
            logger.info(`ℹ️ No career advice found for user: ${userId}`);
            return res.status(404).json({ success: false, message: 'No career advice available' });
        }

        return res.status(200).json({
            success: true,
            userId,
            type,
            advice,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`❌ Error fetching career advice: ${error.message}`, { stack: error.stack });
        return res.status(500).json({
            success: false,
            error: 'Failed to get career advice',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
};

export default { getCareerAdvice };
