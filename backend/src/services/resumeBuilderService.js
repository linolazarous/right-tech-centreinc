const User = require('../models/User');
const Course = require('../models/Course');
const logger = require('../utils/logger');

class ResumeBuilderService {
  static async generateResume(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = await User.findById(userId)
        .populate('coursesCompleted')
        .lean();

      if (!user) {
        throw new Error('User not found');
      }

      // Format skills from completed courses
      const skills = new Set();
      user.coursesCompleted.forEach(course => {
        course.skillsTaught.forEach(skill => skills.add(skill));
      });

      const resume = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        skills: Array.from(skills),
        education: user.educationBackground || [],
        experience: user.workExperience || [],
        courses: user.coursesCompleted.map(course => course.title),
        generatedAt: new Date()
      };

      logger.info(`Resume generated for user ${userId}`);
      return resume;
    } catch (error) {
      logger.error(`Resume generation failed: ${error.message}`);
      throw new Error('Failed to generate resume');
    }
  }
}

module.exports = ResumeBuilderService;
