import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All user routes require a valid authentication token
router.use(authenticateToken);

// User profile management
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Specific user profile by ID
router.get('/:userId', getUserProfile);
router.put('/:userId', updateUserProfile);

export default router;
