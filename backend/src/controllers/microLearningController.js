const { createMicroLesson, getMicroLessons } = require("../services/microLearningService");
const logger = require('../utils/logger');

const createLesson = async (req, res) => {
    const { title, content, duration, tags = [] } = req.body;
    
    try {
        // Validate inputs
        if (!title || typeof title !== 'string') {
            return res.status(400).json({ error: 'Valid title is required' });
        }

        if (!content || typeof content !== 'string') {
            return res.status(400).json({ error: 'Valid content is required' });
        }

        if (isNaN(duration) || duration < 1 || duration > 30) {
            return res.status(400).json({ error: 'Duration must be 1-30 minutes' });
        }

        if (!Array.isArray(tags)) {
            return res.status(400).json({ error: 'Tags must be an array' });
        }

        logger.info(`Creating micro lesson: ${title}`);
        const microLesson = await createMicroLesson({ 
            title, 
            content, 
            duration: parseInt(duration),
            tags
        });

        res.status(201).json({
            lessonId: microLesson._id,
            title: microLesson.title,
            duration: microLesson.duration,
            tags: microLesson.tags,
            createdAt: microLesson.createdAt
        });
    } catch (err) {
        logger.error(`Micro lesson creation error: ${err.message}`, { stack: err.stack });
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to create micro lesson',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

const getAllLessons = async (req, res) => {
    try {
        const { tag, duration, limit = 20 } = req.query;
        
        // Validate inputs
        if (limit && (isNaN(limit) || limit < 1 || limit > 50)) {
            return res.status(400).json({ error: 'Limit must be 1-50' });
        }

        logger.info('Fetching micro lessons');
        const microLessons = await getMicroLessons({
            tag,
            maxDuration: duration,
            limit: parseInt(limit)
        });

        res.status(200).json({
            count: microLessons.length,
            filters: { tag, duration, limit },
            lessons: microLessons
        });
    } catch (err) {
        logger.error(`Micro lessons fetch error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to fetch micro lessons',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = { 
    createLesson, 
    getAllLessons 
};
