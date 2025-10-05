// src/controllers/adminController.js
import { logger } from '../utils/logger.js';

export const getAdminStats = async (req, res) => {
  try {
    // Replace mocks with DB queries later
    const stats = {
      totalUsers: 150,
      totalCourses: 25,
      activeLiveClasses: 3,
      totalRevenue: 12500,
      pendingApprovals: 5,
      activeUsers: 120
    };

    return res.status(200).json({ success: true, stats });
  } catch (err) {
    logger.error('Failed to fetch admin statistics', { message: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Failed to fetch admin statistics' });
  }
};

export default { getAdminStats };
