const { provideTutoring } = require("../services/virtualTutorService");
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

const askTutor = async (req, res) => {
    const { userId, question, context } = req.body;
    
    try {
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (!question || typeof question !== 'string' || question.length < 5) {
            return res.status(400).json({ error: 'Question must be at least 5 characters' });
        }

        if (question.length > 500) {
            return res.status(400).json({ error: 'Question exceeds maximum length of 500 characters' });
        }

        logger.info(`Virtual tutor request from user: ${userId}`);
        const answer = await provideTutoring(userId, question, context);

        res.status(200).json({ 
            userId,
            question,
            answer,
            answeredAt: new Date().toISOString(),
            sources: answer.sources || []
        });
    } catch (err) {
        logger.error(`Virtual tutor error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to get tutor response',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = { 
    askTutor 
};
