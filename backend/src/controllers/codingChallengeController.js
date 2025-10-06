import CodingChallengeModel from '../models/codingChallengeModel.js';
import logger from '../utils/logger.js';

export const getCodingChallenges = async (req, res) => {
  try {
    const { difficulty, language, limit: limitStr = '20' } = req.query;
    const limit = parseInt(limitStr, 10);

    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (language) filter.language = language;

    const challenges = await CodingChallengeModel.find(filter)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    logger.info(`Fetched ${challenges.length} coding challenges`);
    res.status(200).json({ success: true, count: challenges.length, data: challenges });
  } catch (error) {
    logger.error(`Error fetching coding challenges: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to fetch coding challenges.' });
  }
};
