import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/admin.js';
import { getAdminStats } from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Admin dashboard statistics
router.get('/stats', getAdminStats);

// Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const UserModel = (await import('../models/UserModel.js')).default;
    const user = await UserModel.findOne({ email, role: 'admin' }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
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
    res.status(500).json({
      success: false,
      message: 'Admin login failed'
    });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const UserModel = (await import('../models/UserModel.js')).default;
    const users = await UserModel.find().select('-password -twoFASecret');
    
    res.json({ 
      success: true, 
      users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Course management
router.get('/courses', async (req, res) => {
  try {
    const CourseModel = (await import('../models/CourseModel.js')).default;
    const courses = await CourseModel.find().populate('instructor', 'firstName lastName email');
    
    res.json({ 
      success: true, 
      courses,
      count: courses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
});

// Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    const UserModel = (await import('../models/UserModel.js')).default;
    const CourseModel = (await import('../models/CourseModel.js')).default;
    
    const totalUsers = await UserModel.countDocuments();
    const totalCourses = await CourseModel.countDocuments();
    const activeUsers = await UserModel.countDocuments({ status: 'active' });
    
    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalCourses,
        activeUsers,
        liveClasses: 0, // You can implement this later
        revenue: 0 // You can implement this later
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

export default router;
