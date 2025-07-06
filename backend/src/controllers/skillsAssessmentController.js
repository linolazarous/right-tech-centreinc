const skillAssessmentService = require('../services/skillAssessmentService');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

exports.assessSkill = async (req, res) => {
    try {
        const { userId, skill, assessmentType = 'auto' } = req.body;
        
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (!skill || typeof skill !== 'string') {
            return res.status(400).json({ error: 'Valid skill is required' });
        }

        const validTypes = ['auto', 'manual', 'test'];
        if (!validTypes.includes(assessmentType)) {
            return res.status(400).json({ error: 'Invalid assessment type' });
        }

        logger.info(`Assessing ${skill} skill for user: ${userId}`);
        const result = await skillAssessmentService.assessSkill(userId, skill, assessmentType);

        res.status(200).json({
            userId,
            skill,
            assessmentType,
            score: result.score,
            level: result.level,
            recommendations: result.recommendations || [],
            assessedAt: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Skill assessment error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to assess skill',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
