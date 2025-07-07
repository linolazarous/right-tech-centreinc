const StudyGroup = require('../models/StudyGroup');
const logger = require('../utils/logger');

class SocialService {
  static async createStudyGroup(groupData) {
    try {
      if (!groupData.name || !groupData.courseId) {
        throw new Error('Group name and course ID are required');
      }

      const group = new StudyGroup({
        ...groupData,
        createdAt: new Date(),
        status: 'active'
      });

      await group.validate();
      const savedGroup = await group.save();
      
      logger.info(`Study group ${groupData.name} created`);
      return savedGroup;
    } catch (error) {
      logger.error(`Study group creation failed: ${error.message}`);
      throw new Error('Failed to create study group');
    }
  }

  static async getStudyGroups(filters = {}) {
    try {
      const query = { status: 'active' };
      if (filters.courseId) query.courseId = filters.courseId;

      const groups = await StudyGroup.find(query)
        .populate('members', 'name email')
        .populate('courseId', 'title')
        .sort({ createdAt: -1 })
        .lean();

      return groups;
    } catch (error) {
      logger.error(`Failed to fetch study groups: ${error.message}`);
      throw new Error('Failed to retrieve study groups');
    }
  }
}

module.exports = SocialService;
