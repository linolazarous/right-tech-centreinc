const express = require('express');
const mongoose = require('mongoose');
const db = require('./db');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');
const logger = require('./utils/logger');

// Import all routes
const adRoutes = require('./routes/adRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const arLearningRoutes = require('./routes/arLearningRoutes');
const arvrLearningRoutes = require('./routes/arvrLearningRoutes');
const blockChainRoutes = require('./routes/blockChainRoutes');
const careerCoachingRoutes = require('./routes/careerCoachingRoutes');
const careerPathRoutes = require('./routes/careerPathRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const codingChallengeRoutes = require('./routes/codingChallengeRoutes');
const contentCreationRoutes = require('./routes/contentCreationRoutes');
const corporateRoutes = require('./routes/corporateRoutes');
const courseRoutes = require('./routes/courseRoutes');
const forumRoutes = require('./routes/forumRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const jobMatchingRoutes = require('./routes/jobMatchingRoutes');
const jobRoutes = require('./routes/jobRoutes');
const languageSwitcherRoutes = require('./routes/languageSwitcherRoutes');
const learningPathRoutes = require('./routes/learningPathRoutes');
const learningQARoutes = require('./routes/learningQARoutes');
const localizationRoutes = require('./routes/localizationRoutes');
const metaverseRoutes = require('./routes/metaverseRoutes');
const microLearningRoutes = require('./routes/microLearningRoutes');
const moderationRoutes = require('./routes/moderationRoutes');
const offlineRoutes = require('./routes/offlineRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const privacyRoutes = require('./routes/privacyRoutes');
const proctoringRoutes = require('./routes/proctoringRoutes');
const pushNotificationRoutes = require('./routes/pushNotificationRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const resumeBuilderRoutes = require('./routes/resumeBuilderRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const skillsAssessmentRoutes = require('./routes/skillsAssessmentRoutes');
const socialMediaRoutes = require('./routes/socialMediaRoutes');
const socialRoutes = require('./routes/socialRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const translationRoutes = require('./routes/translationRoutes');
const userRoutes = require('./routes/userRoutes');
const virtualLabRoutes = require('./routes/virtualLabRoutes');
const virtualTutorRoutes = require('./routes/virtualTutorRoutes');
const vrCareerFairRoutes = require('./routes/vrCareerFairRoutes');
const vrLabRoutes = require('./routes/vrLabRoutes');
const vrLearningRoutes = require('./routes/vrLearningRoutes');
const zoomRoutes = require('./routes/zoomRoutes');
const authRoutes = require('./routes/authRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const affiliationRoutes = require('./routes/affiliationRoutes');
const accessibilitySettingRoutes = require('./routes/accessibilitySettingRoutes'); // New route

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Use routes
app.use('/api/ads', adRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ar-learning', arLearningRoutes);
app.use('/api/arvr-learning', arvrLearningRoutes);
app.use('/api/blockchain', blockChainRoutes);
app.use('/api/career-coaching', careerCoachingRoutes);
app.use('/api/career-path', careerPathRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/coding-challenges', codingChallengeRoutes);
app.use('/api/content-creation', contentCreationRoutes);
app.use('/api/corporate', corporateRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/job-matching', jobMatchingRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/language-switcher', languageSwitcherRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/learning-qa', learningQARoutes);
app.use('/api/localization', localizationRoutes);
app.use('/api/metaverse', metaverseRoutes);
app.use('/api/micro-learning', microLearningRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/offline', offlineRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/proctoring', proctoringRoutes);
app.use('/api/push-notifications', pushNotificationRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/resume-builder', resumeBuilderRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/skills-assessment', skillsAssessmentRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/translation', translationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/virtual-lab', virtualLabRoutes);
app.use('/api/virtual-tutor', virtualTutorRoutes);
app.use('/api/vr-career-fair', vrCareerFairRoutes);
app.use('/api/vr-lab', vrLabRoutes);
app.use('/api/vr-learning', vrLearningRoutes);
app.use('/api/zoom', zoomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/badges', authMiddleware, badgeRoutes);
app.use('/api/leaderboard', authMiddleware, leaderboardRoutes);
app.use('/api/affiliations', affiliationRoutes);
app.use('/api/accessibility-settings', accessibilitySettingRoutes); // New route

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));