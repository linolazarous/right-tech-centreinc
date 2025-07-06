const scholarshipService = require('../services/scholarshipService');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

exports.allocateScholarship = async (req, res) => {
    try {
        const { studentId, criteria } = req.body;
        
        // Validate inputs
        if (!isValidObjectId(studentId)) {
            return res.status(400).json({ error: 'Invalid student ID format' });
        }

        if (!criteria || typeof criteria !== 'object') {
            return res.status(400).json({ error: 'Valid criteria is required' });
        }

        logger.info(`Allocating scholarship for student: ${studentId}`);
        const result = await scholarshipService.allocateScholarship(studentId, criteria);

        if (!result.eligible) {
            logger.info(`Student ${studentId} not eligible for scholarship`);
            return res.status(200).json(result);
        }

        res.status(200).json({
            studentId,
            scholarshipId: result.scholarshipId,
            amount: result.amount,
            currency: result.currency,
            duration: result.duration,
            awardedAt: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Scholarship allocation error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to allocate scholarship',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
