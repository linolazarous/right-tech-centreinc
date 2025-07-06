const { matchJobs } = require("../services/jobMatchingService");
const { generateResume } = require("../services/resumeService");
const { generateInterviewQuestions, simulateInterview } = require("../services/interviewService");
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

const getJobMatches = async (req, res) => {
    const { userId } = req.body;
    
    try {
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        logger.info(`Finding job matches for user: ${userId}`);
        const [userSkills, userPreferences] = await Promise.all([
            getUserSkills(userId),
            getUserPreferences(userId)
        ]);

        const jobs = await matchJobs(userSkills, userPreferences);

        res.status(200).json({ 
            userId,
            matchesFound: jobs.length,
            skillsMatched: userSkills.length,
            jobs
        });
    } catch (err) {
        logger.error(`Job matching error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to find job matches',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

const createResume = async (req, res) => {
    const { userId, template = 'modern' } = req.body;
    
    try {
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const validTemplates = ['modern', 'classic', 'creative', 'professional'];
        if (!validTemplates.includes(template)) {
            return res.status(400).json({ error: 'Invalid resume template' });
        }

        logger.info(`Generating resume for user: ${userId}`);
        const [userSkills, userExperience] = await Promise.all([
            getUserSkills(userId),
            getUserExperience(userId)
        ]);

        const resume = await generateResume(userSkills, userExperience, template);

        res.status(201).json({ 
            userId,
            template,
            resumeUrl: resume.url,
            generatedAt: new Date().toISOString()
        });
    } catch (err) {
        logger.error(`Resume generation error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to generate resume',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = { 
    getJobMatches, 
    createResume,
    getInterviewQuestions: require('./interviewController').getInterviewQuestions,
    conductMockInterview: require('./interviewController').conductMockInterview
};
