import { createVRLesson } from "../services/vrLearningService.js";
import logger from '../utils/logger.js';
import { validateVRLesson } from '../validators/vrValidator.js';

export const createLesson = async (req, res) => {
    const { lessonName, vrContent, duration, difficulty } = req.body;
    
    try {
        // Validate inputs
        const validation = validateVRLesson({ lessonName, vrContent });
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        logger.info(`Creating VR lesson: ${lessonName}`);
        const lesson = await createVRLesson({
            lessonName, 
            vrContent,
            duration: duration || 30,
            difficulty: difficulty || 'intermediate'
        });

        res.status(201).json({
            lessonId: lesson._id,
            lessonName: lesson.name,
            vrWorldId: lesson.vrWorldId,
            duration: lesson.duration,
            difficulty: lesson.difficulty,
            accessUrl: lesson.accessUrl,
            createdAt: lesson.createdAt
        });
    } catch (err) {
        logger.error(`VR lesson creation error: ${err.message}`, { stack: err.stack });
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to create VR lesson',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export default { 
    createLesson 
};
