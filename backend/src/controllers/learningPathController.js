import learningPathService from '../services/learningPathService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const getLearningPath = async (req, res) => {
    try {
        const { userId } = req.params;
        const { refresh = false } = req.query;
        
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        logger.info(`Getting learning path for user: ${userId}`);
        const path = await learningPathService.getLearningPath(
            userId, 
            refresh === 'true'
        );

        if (!path || path.length === 0) {
            logger.info(`No learning path found for user: ${userId}`);
            return res.status(404).json({ 
                message: 'Learning path not found',
                suggestion: 'Complete your profile to generate a path'
            });
        }

        res.status(200).json({
            userId,
            pathLength: path.length,
            estimatedCompletion: path.estimatedCompletion,
            path,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Learning path error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to get learning path',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    getLearningPath
};
