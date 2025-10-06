import jobPortalService from '../services/jobPortalService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const getJobRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, location, remote } = req.query;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID format' });
    }

    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    logger.info(`Fetching job recommendations for user ${userId}`);
    const jobs = await jobPortalService.getJobRecommendations(
      userId,
      limitNum,
      { location, remote: remote === 'true' }
    );

    res.status(200).json({
      success: true,
      data: {
        userId,
        count: jobs.length,
        filters: { location, remote: remote === 'true' },
        jobs,
        retrievedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error(`Job recommendations error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, error: 'Failed to fetch job recommendations' });
  }
};

export default { getJobRecommendations };
