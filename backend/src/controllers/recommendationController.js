const RecommendationService = require('../services/recommendationService');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type = 'courses', limit = 10 } = req.query;
        
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const validTypes = ['courses', 'articles', 'videos', 'jobs'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid recommendation type' });
        }

        if (isNaN(limit) || limit < 1 || limit > 50) {
            return res.status(400).json({ error: 'Limit must be between 1-50' });
        }

        logger.info(`Getting ${type} recommendations for user: ${userId}`);
        const recommendations = await RecommendationService.getRecommendations(
            userId, 
            type, 
            parseInt(limit)
        );

        res.status(200).json({
            userId,
            type,
            count: recommendations.length,
            recommendations,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Recommendation error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to get recommendations',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
