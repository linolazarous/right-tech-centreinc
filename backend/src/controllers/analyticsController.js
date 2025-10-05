// src/controllers/analyticsController.js
import analyticsService from '../services/analyticsService.js';
import { logger } from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const getStudentProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      logger.warn('Invalid user ID for progress request', { userId });
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const progress = await analyticsService.getStudentProgress(userId);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'No progress data available' });
    }

    return res.status(200).json({ success: true, data: progress });
  } catch (err) {
    logger.error('Error fetching student progress', { message: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getEngagementMetrics = async (req, res) => {
  try {
    const { userId } = req.params;
    const timeframe = req.query.timeframe || '30d';

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const valid = new Set(['7d', '30d', '90d', 'all']);
    if (!valid.has(timeframe)) {
      return res.status(400).json({ success: false, message: 'Invalid timeframe parameter' });
    }

    const metrics = await analyticsService.getEngagementMetrics(userId, timeframe);
    return res.status(200).json({ success: true, data: { userId, timeframe, metrics } });
  } catch (err) {
    logger.error('Error fetching engagement metrics', { message: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export default { getStudentProgress, getEngagementMetrics };
