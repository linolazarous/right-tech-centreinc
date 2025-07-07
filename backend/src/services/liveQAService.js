const LiveSession = require('../models/LiveSession');
const logger = require('../utils/logger');
const { validateLiveSession } = require('../validators/liveValidator');
const { sendNotification } = require('./notificationService');

/**
 * Schedule live Q&A session
 * @param {Object} sessionData - Session data
 * @returns {Promise<Object>} Scheduled session
 */
exports.scheduleLiveQA = async (sessionData) => {
  try {
    const validation = validateLiveSession(sessionData);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info('Scheduling live Q&A session');
    
    const session = new LiveSession({
      ...sessionData,
      status: 'scheduled',
      createdAt: new Date()
    });

    await session.save();

    // Notify participants
    await sendNotification({
      userId: session.hostId,
      message: `Your Q&A session "${session.title}" is scheduled for ${session.startTime}`
    });

    logger.info(`Live session scheduled: ${session._id}`);
    return {
      sessionId: session._id,
      title: session.title,
      hostId: session.hostId,
      startTime: session.startTime,
      duration: session.duration,
      joinUrl: session.joinUrl,
      status: session.status
    };
  } catch (error) {
    logger.error(`Live session scheduling failed: ${error.message}`);
    
    if (error.code === 11000) {
      throw new Error('Session with this title already exists at this time');
    }
    
    throw error;
  }
};
