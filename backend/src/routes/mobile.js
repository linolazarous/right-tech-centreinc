import express from 'express';
import { login as webLogin } from '../controllers/authController.js';
import { getCourse } from '../controllers/courseController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateMobileLogin } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Mobile-optimized login
router.post(
  '/auth/login',
  validateMobileLogin,
  rateLimit('20req/hour'),
  async (req, res) => {
    try {
      const result = await webLogin(req.body);
      res.json({
        ...result,
        mobileData: {
          sessionLifetime: 2592000, // 30 days
          refreshToken: true
        }
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Login failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Mobile-optimized content delivery
router.get(
  '/content/:courseId',
  authMiddleware,
  rateLimit('100req/hour'),
  async (req, res) => {
    try {
      const course = await getCourse(req.params.courseId);
      res.json({
        status: 'success',
        data: {
          ...course,
          videos: course.videos.map(v => ({
            ...v,
            url: `${v.url}?mobile=1&quality=medium`
          }))
        }
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch course',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

export default router;
