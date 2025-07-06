const User = require('../models/User');
const Course = require('../models/Course');
const logger = require('../utils/logger');

/**
 * Get personalized career advice
 * @param {string} userId - User ID
 * @param {string} type - Advice type (general, technical, etc.)
 * @returns {Promise<Object>} Career advice
 */
exports.getCareerAdvice = async (userId, type = 'general') => {
  try {
    logger.info(`Generating career advice for user ${userId}, type ${type}`);
    
    const user = await User.findById(userId)
      .populate('skills')
      .populate('completedCourses');

    if (!user) {
      throw new Error('User not found');
    }

    // Analyze user profile
    const skills = user.skills.map(skill => skill.name);
    const completedCourses = user.completedCourses.map(course => course.title);

    // Generate personalized advice (in a real app, this would use AI)
    const advice = {
      type,
      skillsAnalysis: skills.join(', '),
      recommendedPaths: this.generateRecommendations(skills, completedCourses),
      suggestedCourses: this.suggestCourses(skills),
      generatedAt: new Date().toISOString()
    };

    return advice;
  } catch (error) {
    logger.error(`Career advice generation failed: ${error.message}`);
    throw error;
  }
};

// Helper methods
exports.generateRecommendations = (skills, completedCourses) => {
  // Simplified logic - real implementation would be more sophisticated
  if (skills.includes('JavaScript') && skills.includes('React')) {
    return ['Frontend Developer', 'Full Stack Developer'];
  }
  if (skills.includes('Python') && skills.includes('Data Analysis')) {
    return ['Data Scientist', 'Machine Learning Engineer'];
  }
  return ['Software Developer', 'Technical Consultant'];
};

exports.suggestCourses = (skills) => {
  // Simplified logic - real implementation would query the database
  if (skills.includes('JavaScript')) {
    return ['Advanced React', 'Node.js Fundamentals'];
  }
  return ['Introduction to Programming', 'Career Development'];
};
