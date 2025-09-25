import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { getAdminStats } from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Admin dashboard statistics
router.get('/stats', getAdminStats);

// Add more admin routes here
router.get('/users', (req, res) => {
  res.json({ success: true, message: 'User management endpoint' });
});

router.get('/courses', (req, res) => {
  res.json({ success: true, message: 'Course management endpoint' });
});

export default router;
