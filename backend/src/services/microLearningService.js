import MicroLesson from '../models/MicroLesson.js';
import logger from '../utils/logger.js';
import { validateMicroLesson } from '../validators/microlearningValidator.js';

/**
 * Create micro lesson
 * @param {Object} lessonData - Lesson data
 * @returns {Promise<Object>} Created lesson
 */
export const createMicroLesson = async (lessonData) => {
  try {
    const validation = validateMicroLesson(lessonData);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info('Creating micro lesson');
    
    const lesson = new MicroLesson({
      ...lessonData,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await lesson.save();
    
    logger.info(`Micro lesson created: ${lesson._id}`);
    return {
      id: lesson._id,
      title: lesson.title,
      duration: lesson.duration,
      tags: lesson.tags,
      status: lesson.status,
      createdAt: lesson.createdAt
    };
  } catch (error) {
    logger.error(`Micro lesson creation failed: ${error.message}`);
    
    if (error.code === 11000) {
      throw new Error('Micro lesson with this title already exists');
    }
    
    throw error;
  }
};

/**
 * Get micro lessons with optional filters
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} List of lessons
 */
export const getMicroLessons = async (filters = {}) => {
  try {
    const { tag, maxDuration, limit = 20 } = filters;
    
    const query = { status: 'published' };
    if (tag) query.tags = tag;
    if (maxDuration) query.duration = { $lte: parseInt(maxDuration) };

    logger.info('Fetching micro lessons with filters', { filters });
    
    const lessons = await MicroLesson.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    return lessons.map(lesson => ({
      id: lesson._id,
      title: lesson.title,
      duration: lesson.duration,
      tags: lesson.tags,
      createdAt: lesson.createdAt
    }));
  } catch (error) {
    logger.error(`Error fetching micro lessons: ${error.message}`);
    throw error;
  }
};
