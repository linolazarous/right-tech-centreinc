import Course from '../models/Course.js';
import logger from '../utils/logger.js';
import { validateCourseId } from '../validators/courseValidator.js';
import { generateCoursePackage } from '../utils/offlineUtils.js';

/**
 * Download course for offline use
 * @param {string} courseId - Course ID
 * @returns {Promise<Object>} Course download package
 */
export const downloadCourse = async (courseId) => {
  try {
    const validation = validateCourseId(courseId);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info(`Preparing offline download for course ${courseId}`);
    
    const course = await Course.findById(courseId)
      .populate('lessons')
      .populate('resources');

    if (!course) {
      throw new Error('Course not found');
    }

    if (!course.availableOffline) {
      throw new Error('This course is not available for offline use');
    }

    // Generate downloadable package
    const package = await generateCoursePackage(course);
    
    logger.info(`Offline package generated for course ${courseId}`);
    return {
      courseId: course._id,
      title: course.title,
      format: package.format,
      fileSize: package.fileSize,
      downloadUrl: package.url,
      expiresAt: package.expiresAt
    };
  } catch (error) {
    logger.error(`Offline download failed: ${error.message}`);
    throw error;
  }
};
