import User from '../models/User.js';
import CareerPath from '../models/CareerPath.js';
import logger from '../utils/logger.js';

/**
 * Recommend career paths based on user profile
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Recommended career paths
 */
export const recommendCareerPath = async (userId) => {
  try {
    logger.info(`Generating career path recommendations for user ${userId}`);
    
    const user = await User.findById(userId)
      .populate('skills')
      .populate('completedCourses');

    if (!user) {
      throw new Error('User not found');
    }

    // Get all career paths
    const allPaths = await CareerPath.find()
      .sort({ demand: -1 })
      .limit(50);

    // Score paths based on user profile
    const scoredPaths = allPaths.map(path => ({
      ...path.toObject(),
      score: calculatePathScore(path, user)
    }));

    // Sort by score and return top 5
    return scoredPaths
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(path => ({
        id: path._id,
        title: path.title,
        description: path.description,
        matchScore: path.score,
        requiredSkills: path.requiredSkills,
        salaryRange: path.salaryRange
      }));
  } catch (error) {
    logger.error(`Career path recommendation failed: ${error.message}`);
    throw error;
  }
};

/**
 * Calculate how well a career path matches user profile
 * @param {Object} path - Career path
 * @param {Object} user - User profile
 * @returns {number} Match score (0-100)
 */
export const calculatePathScore = (path, user) => {
  const userSkills = new Set(user.skills.map(skill => skill.name));
  const requiredSkills = new Set(path.requiredSkills);

  // Calculate skill match percentage
  const matchedSkills = [...requiredSkills].filter(skill => 
    userSkills.has(skill)
  ).length;

  const skillScore = (matchedSkills / requiredSkills.size) * 50;

  // Add bonus for completed relevant courses
  const courseScore = Math.min(user.completedCourses.length, 10) * 2;

  // Add bonus for path demand
  const demandScore = path.demand === 'high' ? 20 : 
                     path.demand === 'medium' ? 10 : 0;

  return Math.min(skillScore + courseScore + demandScore, 100);
};
