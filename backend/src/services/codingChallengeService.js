const CodingChallenge = require('../models/CodingChallenge');
const logger = require('../utils/logger');

/**
 * Get coding challenges with filters
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} List of coding challenges
 */
exports.getCodingChallenges = async (filters = {}) => {
  try {
    const { difficulty, language, limit = 20 } = filters;

    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (language) query.language = language;

    logger.info('Fetching coding challenges with filters', { filters });

    const challenges = await CodingChallenge.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-solution -__v');

    return challenges.map(challenge => ({
      id: challenge._id,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      language: challenge.language,
      testCases: challenge.testCases.length,
      createdAt: challenge.createdAt
    }));
  } catch (error) {
    logger.error(`Error fetching coding challenges: ${error.message}`);
    throw error;
  }
};
