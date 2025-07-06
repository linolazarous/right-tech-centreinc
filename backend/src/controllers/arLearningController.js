const { createARLesson } = require("../services/arLearningService");
const logger = require('../utils/logger');
const { validateARContent } = require('../validators/arValidator');

const createLesson = async (req, res) => {
    const { lessonName, arContent } = req.body;
    
    try {
        // Validate input
        if (!lessonName || typeof lessonName !== 'string' || lessonName.length < 3) {
            return res.status(400).json({ error: 'Lesson name must be at least 3 characters' });
        }

        const contentValidation = validateARContent(arContent);
        if (!contentValidation.valid) {
            return res.status(400).json({ error: contentValidation.message });
        }

        const lesson = await createARLesson(lessonName, arContent);
        
        logger.info(`AR Lesson created: ${lesson._id}`);
        res.status(201).json({
            id: lesson._id,
            name: lesson.lessonName,
            createdAt: lesson.createdAt,
            status: 'active'
        });
    } catch (err) {
        logger.error(`Error creating AR lesson: ${err.message}`, { stack: err.stack });
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to create AR lesson',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = { 
    createLesson 
};
