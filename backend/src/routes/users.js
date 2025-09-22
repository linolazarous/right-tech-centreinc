import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 🔥 REMOVED: register and login routes (moved to auth.js)

// Protect all user routes
router.use(authenticateToken);

// User profile management
router.get('/profile', (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get('/:userId', getUserProfile);
router.put('/:userId', updateUserProfile);

// Add more protected user routes here
router.put('/profile', (req, res) => {
  res.json({ success: true, message: 'Profile updated' });
});

export default router;
