import analyticsService from '../services/analyticsService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

/**
 * Get student progress analytics
 */
export const getStudentProgress = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate user ID
        if (!isValidObjectId(userId)) {
            logger.warn(`Invalid user ID format: ${userId}`);
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const progress = await analyticsService.getStudentProgress(userId);
        
        if (!progress) {
            logger.info(`No progress data found for user: ${userId}`);
            return res.status(404).json({ message: 'No progress data available' });
        }

        logger.info(`Successfully retrieved progress for user: ${userId}`);
        res.status(200).json(progress);
    } catch (error) {
        logger.error(`Error getting student progress: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Get student engagement metrics
 */
export const getEngagementMetrics = async (req, res) => {
    try {
        const { userId } = req.params;
        const { timeframe = '30d' } = req.query;

        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const validTimeframes = ['7d', '30d', '90d', 'all'];
        if (!validTimeframes.includes(timeframe)) {
            return res.status(400).json({ error: 'Invalid timeframe parameter' });
        }

        const metrics = await analyticsService.getEngagementMetrics(userId, timeframe);
        
        logger.info(`Successfully retrieved engagement metrics for user: ${userId}`);
        res.status(200).json({
            userId,
            timeframe,
            metrics
        });
    } catch (error) {
        logger.error(`Error getting engagement metrics: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    getStudentProgress,
    getEngagementMetrics
};
