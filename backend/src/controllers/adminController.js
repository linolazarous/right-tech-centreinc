import User from '../models/User.js';
import Course from '../models/Course.js';
import LiveClass from '../models/LiveClass.js';
import Payment from '../models/Payment.js';

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      activeLiveClasses,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      LiveClass.countDocuments({ status: 'scheduled' }),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        activeLiveClasses,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingApprovals: await Course.countDocuments({ status: 'pending' }),
        activeUsers: await User.countDocuments({ isActive: true })
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics'
    });
  }
};
