import User from '../models/User.js';
import Course from '../models/Course.js';
import logger from '../utils/logger.js';
import { validateUserId } from '../validators/userValidator.js';

/**
 * Get personalized learning path for user
 * @param {string} userId - User ID
 * @param {boolean} refresh - Force refresh of path
 * @returns {Promise<Object>} Learning path
 */
export const getLearningPath = async (userId, refresh = false) => {
  try {
    const validation = validateUserId(userId);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info(`Generating learning path for user ${userId}`);
    
    const user = await User.findById(userId)
      .populate('skills')
      .populate('completedCourses');

    if (!user) {
      throw new Error('User not found');
    }

    // Get recommended courses based on skills and goals
    const query = {
      prerequisites: { $in: user.skills.map(skill => skill._id) },
      _id: { $nin: user.completedCourses.map(course => course._id) }
    };

    const recommendedCourses = await Course.find(query)
      .sort({ level: 1 })
      .limit(10)
      .select('title description level duration');

    if (recommendedCourses.length === 0) {
      // Fallback to popular courses if no specific recommendations
      const popularCourses = await Course.find()
        .sort({ enrolledCount: -1 })
        .limit(5)
        .select('title description level duration');
      recommendedCourses.push(...popularCourses);
    }

    // Estimate completion time (sum of course durations in hours)
    const estimatedCompletion = recommendedCourses.reduce(
      (sum, course) => sum + (course.duration || 0), 0
    );

    logger.info(`Generated path with ${recommendedCourses.length} courses for user ${userId}`);
    return {
      userId: user._id,
      skillLevel: user.skillLevel || 'beginner',
      recommendedCourses,
      estimatedCompletion,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Learning path generation failed: ${error.message}`);
    throw error;
  }
};
