const { generateCourseContent } = require("../services/contentCreationService");
const logger = require('../utils/logger');

const createCourseContent = async (req, res) => {
    const { topic, audience, depth = 'intermediate' } = req.body;
    
    try {
        // Validate inputs
        if (!topic || typeof topic !== 'string' || topic.length < 5) {
            return res.status(400).json({ error: 'Topic must be at least 5 characters' });
        }

        if (!audience || typeof audience !== 'string') {
            return res.status(400).json({ error: 'Invalid audience specification' });
        }

        const validDepthLevels = ['beginner', 'intermediate', 'advanced'];
        if (!validDepthLevels.includes(depth)) {
            return res.status(400).json({ error: 'Invalid depth level' });
        }

        logger.info(`Generating course content for topic: ${topic}`);
        const content = await generateCourseContent({ topic, audience, depth });

        logger.info(`Successfully generated content for topic: ${topic}`);
        res.status(201).json({ 
            topic,
            audience,
            depth,
            content,
            generatedAt: new Date().toISOString()
        });
    } catch (err) {
        logger.error(`Error generating course content: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to generate course content',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = { 
    createCourseContent 
};
