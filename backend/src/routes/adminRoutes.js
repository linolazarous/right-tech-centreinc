// src/routes/adminRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/admin.js';
import { getAdminStats } from '../controllers/adminController.js';

const router = express.Router();

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin and issue JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const { default: UserModel } = await import('../models/UserModel.js');
    const user = await UserModel.findOne({ email, role: 'admin' }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.'
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      token,
      admin: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Admin login failed due to server error.'
    });
  }
});

// Protect all routes below this line
router.use(authenticateToken, requireAdmin);

/**
 * @route   GET /api/admin/stats
 * @desc    Retrieve admin dashboard statistics
 * @access  Private (Admin only)
 */
router.get('/stats', getAdminStats);

/**
 * @route   GET /api/admin/users
 * @desc    Retrieve all registered users
 * @access  Private (Admin only)
 */
router.get('/users', async (req, res) => {
  try {
    const { default: UserModel } = await import('../models/UserModel.js');
    const users = await UserModel.find().select('-password -twoFASecret');

    return res.status(200).json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users.'
    });
  }
});

/**
 * @route   GET /api/admin/courses
 * @desc    Retrieve all courses with instructor info
 * @access  Private (Admin only)
 */
router.get('/courses', async (req, res) => {
  try {
    const { default: CourseModel } = await import('../models/CourseModel.js');
    const courses = await CourseModel.find().populate('instructor', 'firstName lastName email');

    return res.status(200).json({
      success: true,
      courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch courses.'
    });
  }
});

/**
 * @route   GET /api/admin/analytics
 * @desc    Retrieve system-wide analytics
 * @access  Private (Admin only)
 */
router.get('/analytics', async (req, res) => {
  try {
    const { default: UserModel } = await import('../models/UserModel.js');
    const { default: CourseModel } = await import('../models/CourseModel.js');

    const [totalUsers, totalCourses, activeUsers] = await Promise.all([
      UserModel.countDocuments(),
      CourseModel.countDocuments(),
      UserModel.countDocuments({ status: 'active' })
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalCourses,
        activeUsers,
        liveClasses: 0,
        revenue: 0
      }
    });
  } catch (error) {
    console.error('Fetch analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics.'
    });
  }
});

export default router;
