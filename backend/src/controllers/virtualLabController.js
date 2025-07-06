const virtualLabService = require('../services/virtualLabService');
const logger = require('../utils/logger');

exports.getVirtualLabs = async (req, res) => {
    try {
        const { subject, difficulty, limit = 20 } = req.query;
        
        // Validate inputs
        if (limit && (isNaN(limit) || limit < 1 || limit > 50)) {
            return res.status(400).json({ error: 'Limit must be between 1-50' });
        }

        logger.info('Fetching virtual labs', { subject, difficulty });
        const labs = await virtualLabService.getVirtualLabs({
            subject,
            difficulty,
            limit: parseInt(limit)
        });

        res.status(200).json({
            count: labs.length,
            filters: { subject, difficulty, limit },
            labs
        });
    } catch (error) {
        logger.error(`Virtual labs fetch error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to fetch virtual labs',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
