const { generateInterviewQuestions, simulateInterview } = require("../services/interviewService");
const logger = require('../utils/logger');

const getInterviewQuestions = async (req, res) => {
    const { jobRole, difficulty = 'medium', count = 10 } = req.body;
    
    try {
        // Validate inputs
        if (!jobRole || typeof jobRole !== 'string') {
            return res.status(400).json({ error: 'Job role is required' });
        }

        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({ error: 'Invalid difficulty level' });
        }

        if (isNaN(count) || count < 1 || count > 20) {
            return res.status(400).json({ error: 'Count must be between 1-20' });
        }

        logger.info(`Generating interview questions for: ${jobRole}`);
        const questions = await generateInterviewQuestions(jobRole, difficulty, parseInt(count));

        res.status(200).json({ 
            jobRole,
            difficulty,
            count: questions.length,
            questions,
            generatedAt: new Date().toISOString()
        });
    } catch (err) {
        logger.error(`Interview question generation error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to generate interview questions',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

const conductMockInterview = async (req, res) => {
    const { jobRole, userResponses } = req.body;
    
    try {
        // Validate inputs
        if (!jobRole || typeof jobRole !== 'string') {
            return res.status(400).json({ error: 'Job role is required' });
        }

        if (!Array.isArray(userResponses) || userResponses.length === 0) {
            return res.status(400).json({ error: 'User responses must be an array' });
        }

        logger.info(`Conducting mock interview for: ${jobRole}`);
        const feedback = await simulateInterview(jobRole, userResponses);

        res.status(200).json({ 
            jobRole,
            questionsCount: userResponses.length,
            feedback,
            completedAt: new Date().toISOString()
        });
    } catch (err) {
        logger.error(`Mock interview error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to conduct mock interview',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = { 
    getInterviewQuestions, 
    conductMockInterview 
};
