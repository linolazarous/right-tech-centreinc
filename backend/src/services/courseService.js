import CourseModel from '../models/courseModel.js';
import logger from '../utils/logger.js';
import { validateCourse } from '../validators/courseValidator.js';

class CourseService {
  /**
   * Get courses with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of courses
   */
  static async getCourses(filters = {}) {
    try {
      const { category, limit = 20 } = filters;
      
      const query = {};
      if (category) query.category = category;

      logger.info('Fetching courses with filters', { filters });
      return await CourseModel.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .select('-__v');
    } catch (error) {
      logger.error(`Error fetching courses: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add a new course
   * @param {Object} courseData - Course data
   * @returns {Promise<Object>} Created course
   */
  static async addCourse(courseData) {
    try {
      const validation = validateCourse(courseData);
      if (!validation.valid) {
        throw new Error(validation.message);
      }

      logger.info('Creating new course');
      const newCourse = new CourseModel({
        ...courseData,
        status: 'draft',
        createdAt: new Date()
      });

      await newCourse.save();
      logger.info(`Course created: ${newCourse._id}`);
      
      return {
        id: newCourse._id,
        title: newCourse.title,
        instructor: newCourse.instructor,
        status: newCourse.status,
        createdAt: newCourse.createdAt
      };
    } catch (error) {
      logger.error(`Course creation failed: ${error.message}`);
      
      if (error.code === 11000) {
        throw new Error('Course with this title already exists');
      }
      
      throw error;
    }
  }
}

export default CourseService;
