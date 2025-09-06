import User from '../models/User.js';
import Course from '../models/Course.js';
import logger from '../utils/logger.js';

/**
 * Get student progress analytics
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Course progress data
 */
export const getStudentProgress = async (userId) => {
  try {
    logger.info(`Fetching progress for user ${userId}`);
    const user = await User.findById(userId)
      .populate({
        path: 'enrolledCourses.course',
        select: 'title description'
      });

    if (!user) {
      throw new Error('User not found');
    }

    return user.enrolledCourses.map((enrollment) => ({
      courseId: enrollment.course._id,
      courseTitle: enrollment.course.title,
      progress: enrollment.progress || 0,
      lastAccessed: enrollment.lastAccessed
    }));
  } catch (error) {
    logger.error(`Error getting progress for user ${userId}: ${error.message}`);
    throw error;
    }
};

/**
 * Get student engagement metrics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Engagement metrics
 */
export const getEngagementMetrics = async (userId) => {
  try {
    logger.info(`Fetching engagement metrics for user ${userId}`);
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Calculate actual metrics from user activity
    return {
      timeSpent: user.totalLearningTime || 0,
      quizzesTaken: user.quizzesCompleted?.length || 0,
      coursesCompleted: user.completedCourses?.length || 0,
      lastActive: user.lastActive
    };
  } catch (error) {
    logger.error(`Error getting engagement for user ${userId}: ${error.message}`);
    throw error;
  }
};
