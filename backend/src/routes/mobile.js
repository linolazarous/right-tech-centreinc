import express from 'express';
import * as authController from '../controllers/authController.js';
import * as courseController from '../controllers/courseController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateMobileLogin } from '../middleware/validationMiddleware.js';
import rateLimit from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Mobile login (delegates to web logic)
router.post(
  '/auth/login',
  validateMobileLogin,
  rateLimit('20req/hour'),
  async (req, res, next) => {
    try {
      req.isMobile = true; // Optional flag for controller logic
      await authController.login(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Mobile-friendly course content
router.get(
  '/content/:courseId',
  authMiddleware,
  rateLimit('100req/hour'),
  async (req, res) => {
    try {
      const course = await courseController.getCourse(req, res);
      if (!course || !course.videos) return;

      // Adjust video URLs for mobile
      course.videos = course.videos.map(v => ({
        ...v,
        url: `${v.url}?mobile=1&quality=medium`
      }));

      res.json({
        status: 'success',
        data: course
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch course content',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

export default router;
