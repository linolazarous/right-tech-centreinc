import User from '../models/User.js';
import Job from '../models/Job.js';
import logger from '../utils/logger.js';
import { validateJobMatchInput } from '../validators/jobValidator.js';

/**
 * Match jobs based on user skills and preferences
 * @param {Array} userSkills - User skills
 * @param {Object} userPreferences - User preferences
 * @returns {Promise<Array>} Matched jobs
 */
export const matchJobs = async (userSkills, userPreferences) => {
  try {
    const validation = validateJobMatchInput({ userSkills, userPreferences });
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info('Matching jobs based on skills and preferences');
    
    // Build query based on skills and preferences
    const query = {
      requiredSkills: { $in: userSkills },
      status: 'active'
    };

    if (userPreferences.location) {
      query.location = userPreferences.location;
    }

    if (userPreferences.salaryMin) {
      query.salary = { $gte: userPreferences.salaryMin };
    }

    if (userPreferences.jobType) {
      query.jobType = userPreferences.jobType;
    }

    // Find matching jobs
    const matchedJobs = await Job.find(query)
      .sort({ postedDate: -1 })
      .limit(20)
      .select('-applicants -__v');

    // Score matches
    const scoredJobs = matchedJobs.map(job => ({
      ...job.toObject(),
      matchScore: calculateMatchScore(job, userSkills, userPreferences)
    }));

    // Sort by match score
    const sortedJobs = scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    logger.info(`Found ${sortedJobs.length} matching jobs`);
    return sortedJobs;
  } catch (error) {
    logger.error(`Job matching failed: ${error.message`);
    throw error;
  }
};

/**
 * Calculate job match score
 * @param {Object} job - Job data
 * @param {Array} userSkills - User skills
 * @param {Object} preferences - User preferences
 * @returns {number} Match score (0-100)
 */
const calculateMatchScore = (job, userSkills, preferences) => {
  // Skill match (50% weight)
  const matchedSkills = job.requiredSkills.filter(skill => 
    userSkills.includes(skill)
  ).length;
  const skillScore = (matchedSkills / job.requiredSkills.length) * 50;

  // Preference match (50% weight)
  let preferenceScore = 0;
  
  if (job.location === preferences.location) preferenceScore += 20;
  if (job.jobType === preferences.jobType) preferenceScore += 15;
  if (job.salary >= preferences.salaryMin) preferenceScore += 15;

  return Math.min(skillScore + preferenceScore, 100);
};

export { matchJobs };
