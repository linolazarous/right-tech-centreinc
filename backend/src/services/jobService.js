const Job = require('../models/Job');
const User = require('../models/User');
const logger = require('../utils/logger');
const { validateUserId } = require('../validators/userValidator');

/**
 * Get job recommendations for user
 * @param {string} userId - User ID
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} Recommended jobs
 */
exports.getJobRecommendations = async (userId, options = {}) => {
  try {
    const validation = validateUserId(userId);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info(`Fetching job recommendations for user ${userId}`);
    
    const user = await User.findById(userId).select('skills');
    if (!user) {
      throw new Error('User not found');
    }

    // Build recommendation query
    const { limit = 10, location, remote } = options;
    const query = {
      requiredSkills: { $in: user.skills },
      status: 'active'
    };

    if (location) query.location = location;
    if (remote) query.isRemote = true;

    const jobs = await Job.find(query)
      .sort({ postedDate: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    logger.info(`Found ${jobs.length} recommendations for user ${userId}`);
    return jobs.map(job => ({
      id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      isRemote: job.isRemote,
      skills: job.requiredSkills,
      postedDate: job.postedDate
    }));
  } catch (error) {
    logger.error(`Job recommendation failed: ${error.message}`);
    throw error;
  }
};
