// =================================================================
//                    Main API Router
// =================================================================
import express from 'express';

// Import all route files
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import courseRoutes from './courseRoutes.js';
import adminRoutes from './adminRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import forumRoutes from './forumRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import jobRoutes from './jobRoutes.js';
import careerPathRoutes from './careerPathRoutes.js';
import skillsAssessmentRoutes from './skillsAssessmentRoutes.js';
import vrLearningRoutes from './vrLearningRoutes.js';
import gamificationRoutes from './gamificationRoutes.js';
import subscriptionRoutes from './subscriptionRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = express.Router();

// Mount individual routers (no double /api prefix)
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/courses', courseRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/payments', paymentRoutes);
router.use('/api/analytics', analyticsRoutes);
router.use('/api/forum', forumRoutes);
router.use('/api/certificates', certificateRoutes);
router.use('/api/jobs', jobRoutes);
router.use('/api/career-paths', careerPathRoutes);
router.use('/api/skills', skillsAssessmentRoutes);
router.use('/api/vr-learning', vrLearningRoutes);
router.use('/api/gamification', gamificationRoutes);
router.use('/api/subscriptions', subscriptionRoutes);
router.use('/api/notifications', notificationRoutes);

// Health Check
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Right Tech Centre API is operational',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 fallback
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.',
    path: req.originalUrl,
  });
});

export default router;
