import express from 'express';
// FIX: Import individual functions instead of default import
import { register, login } from '../controllers/userController.js';
import { 
  validateUserRegistration, 
  validateUserLogin, 
  validateRequest 
} from '../middleware/validationMiddleware.js';
import { authenticateToken } from '../middleware/auth.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post(
  '/register',
  validateUserRegistration,
  validateRequest,
  rateLimit('10req/hour'),
  register  // ✅ Fixed: use imported function
);

router.post(
  '/login',
  validateUserLogin,
  validateRequest,
  rateLimit('20req/hour'),
  login  // ✅ Fixed: use imported function
);

// Protected routes (authentication required)
router.use(authenticateToken);

router.get('/profile', (req, res) => {
  res.json({ success: true, user: req.user });
});

// Add more protected user routes here
router.put('/profile', (req, res) => {
  res.json({ success: true, message: 'Profile updated' });
});

export default router;
