import User from '../models/User.js';
import Course from '../models/Course.js';
import logger from '../utils/logger.js';

class RecommendationService {
  static async getRecommendations(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = await User.findById(userId)
        .populate('coursesEnrolled')
        .lean();

      if (!user) {
        throw new Error('User not found');
      }

      // Basic recommendation logic - can be enhanced with ML
      const recommendations = user.coursesEnrolled || [];
      
      // Add popular courses if user has few enrollments
      if (recommendations.length < 3) {
        const popularCourses = await Course.find({ isPopular: true })
          .limit(3 - recommendations.length)
          .lean();
        recommendations.push(...popularCourses);
      }

      logger.info(`Generated ${recommendations.length} recommendations for user ${userId}`);
      return recommendations;
    } catch (error) {
      logger.error(`Recommendation generation failed: ${error.message}`);
      throw new Error('Failed to generate recommendations');
    }
  }
}

export default RecommendationService;
