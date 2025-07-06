const jobPortalService = require('../services/jobPortalService');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

exports.getJobRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 10, location, remote } = req.query;
        
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (isNaN(limit) || limit < 1 || limit > 50) {
            return res.status(400).json({ error: 'Limit must be between 1-50' });
        }

        logger.info(`Fetching job recommendations for user: ${userId}`);
        const jobs = await jobPortalService.getJobRecommendations(
            userId, 
            parseInt(limit), 
            { location, remote: remote === 'true' }
        );

        res.status(200).json({
            userId,
            count: jobs.length,
            filters: { limit, location, remote },
            jobs,
            retrievedAt: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Job recommendation error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to get job recommendations',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
