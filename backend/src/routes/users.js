// routes/users.js - Now this will work correctly
import express from 'express';
import { register, login } from '../controllers/userController.js'; // ✅ Now correct
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
  register  // ✅ Now matches export
);

router.post(
  '/login',
  validateUserLogin,
  validateRequest,
  rateLimit('20req/hour'),
  login  // ✅ Now matches export
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
