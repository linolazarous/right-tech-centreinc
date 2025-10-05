// src/controllers/arLearningController.js
import { createARLesson } from '../services/arLearningService.js';
import { logger } from '../utils/logger.js';
import { validateARContent } from '../validators/arValidator.js';

export const createLesson = async (req, res) => {
  try {
    const { lessonName, arContent } = req.body;

    if (!lessonName || typeof lessonName !== 'string' || lessonName.length < 3) {
      return res.status(400).json({ success: false, message: 'Lesson name must be at least 3 characters' });
    }

    const validation = validateARContent(arContent);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const lesson = await createARLesson(lessonName, arContent);
    logger.info('AR lesson created', { lessonId: lesson._id });

    return res.status(201).json({
      success: true,
      data: { id: lesson._id, name: lesson.lessonName, createdAt: lesson.createdAt }
    });
  } catch (err) {
    logger.error('Error creating AR lesson', { message: err.message, stack: err.stack });
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Failed to create AR lesson' });
  }
};

export default { createLesson };
