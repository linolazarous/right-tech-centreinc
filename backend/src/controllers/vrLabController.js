const vrLabService = require('../services/vrLabService');
const logger = require('../utils/logger');

exports.getVRLabs = async (req, res) => {
    try {
        const { category, equipment, limit = 20 } = req.query;
        
        // Validate inputs
        if (limit && (isNaN(limit) || limit < 1 || limit > 50)) {
            return res.status(400).json({ error: 'Limit must be between 1-50' });
        }

        logger.info('Fetching VR labs', { category, equipment });
        const labs = await vrLabService.getVRLabs({
            category,
            equipment,
            limit: parseInt(limit)
        });

        res.status(200).json({
            count: labs.length,
            filters: { category, equipment, limit },
            labs
        });
    } catch (error) {
        logger.error(`VR labs fetch error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to fetch VR labs',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
