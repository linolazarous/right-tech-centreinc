export const getAdminStats = async (req, res) => {
  try {
    // Mock stats - replace with actual database queries
    const stats = {
      totalUsers: 150,
      totalCourses: 25,
      activeLiveClasses: 3,
      totalRevenue: 12500,
      pendingApprovals: 5,
      activeUsers: 120
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics'
    });
  }
};
