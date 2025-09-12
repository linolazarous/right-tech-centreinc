import express from 'express';
import { login, getAuthStatus } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/status', authenticateToken, getAuthStatus);

export default router;
