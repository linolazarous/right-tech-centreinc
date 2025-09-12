import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protect all user routes
router.use(authenticateToken);

router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
