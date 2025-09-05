import admin from 'firebase-admin';
import logger from './logger.js';
import User from './models/user.js'; // Assuming you have a User model

// Initialize Firebase Admin with environment variables
const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      logger.info('✅ Firebase Admin initialized successfully');
    }
  } catch (error) {
    logger.error('❌ Firebase initialization failed', { error: error.message });
    throw error;
  }
};

// Initialize on import
initializeFirebase();

// Notification service with enhanced features
const notificationService = {
  /**
   * Send notification to a user
   * @param {string} userId - User ID to send notification to
   * @param {string} message - Notification message body
   * @param {object} [options] - Additional options
   * @param {string} [options.title='Right Tech Centre'] - Notification title
   * @param {object} [options.data] - Additional data payload
   * @param {string} [options.imageUrl] - URL for notification image
   * @returns {Promise<object>} - Firebase message response
   */
  sendToUser: async (userId, message, options = {}) => {
    try {
      const user = await User.findById(userId).select('fcmToken notificationSettings');
      
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      if (!user.fcmToken) {
        logger.warn(`User ${userId} has no FCM token`, { userId });
        return { success: false, message: 'User has no FCM token' };
      }

      // Check user notification preferences
      if (user.notificationSettings?.enabled === false) {
        logger.debug(`Notifications disabled for user ${userId}`);
        return { success: false, message: 'Notifications disabled by user' };
      }

      const messagePayload = {
        token: user.fcmToken,
        notification: {
          title: options.title || 'Right Tech Centre',
          body: message,
          imageUrl: options.imageUrl
        },
        data: options.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'default_channel'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default'
            }
          }
        }
      };

      const response = await admin.messaging().send(messagePayload);
      logger.info(`Notification sent to user ${userId}`, { 
        userId, 
        messageId: response,
        messageContent: message 
      });

      return { 
        success: true, 
        messageId: response,
        fcmToken: user.fcmToken 
      };
    } catch (error) {
      logger.error('Failed to send notification', {
        error: error.message,
        stack: error.stack,
        userId,
        message
      });

      // Handle specific Firebase errors
      if (error.code === 'messaging/invalid-registration-token' || 
          error.code === 'messaging/registration-token-not-registered') {
        // Remove invalid token from user record
        await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
        logger.warn(`Removed invalid FCM token for user ${userId}`);
      }

      throw error;
    }
  },

  /**
   * Send notification to multiple users
   * @param {string[]} userIds - Array of user IDs
   * @param {string} message - Notification message body
   * @param {object} [options] - Additional options
   * @returns {Promise<object>} - Batch send results
   */
  sendToUsers: async (userIds, message, options = {}) => {
    const results = {
      successCount: 0,
      failureCount: 0,
      details: []
    };

    // Process in batches of 500 (Firebase limit)
    const batchSize = 500;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(userId => this.sendToUser(userId, message, options))
      );

      batchResults.forEach((result, index) => {
        const userId = batch[index];
        if (result.status === 'fulfilled') {
          results.successCount++;
          results.details.push({
            userId,
            status: 'success',
            messageId: result.value.messageId
          });
        } else {
          results.failureCount++;
          results.details.push({
            userId,
            status: 'failed',
            error: result.reason.message
          });
        }
      });
    }

    logger.info(`Batch notification completed`, {
      total: userIds.length,
      successCount: results.successCount,
      failureCount: results.failureCount
    });

    return results;
  },

  /**
   * Subscribe user to topic
   * @param {string} userId - User ID
   * @param {string} topic - Topic to subscribe to
   * @returns {Promise<object>} - Subscription result
   */
  subscribeToTopic: async (userId, topic) => {
    try {
      const user = await User.findById(userId).select('fcmToken');
      if (!user?.fcmToken) {
        throw new Error(`User ${userId} has no FCM token`);
      }

      const response = await admin.messaging().subscribeToTopic(user.fcmToken, topic);
      if (response.errors?.length > 0) {
        throw new Error(response.errors[0].error);
      }

      logger.info(`User ${userId} subscribed to topic ${topic}`, { userId, topic });
      return { success: true, topic };
    } catch (error) {
      logger.error(`Failed to subscribe user ${userId} to topic ${topic}`, {
        error: error.message,
        userId,
        topic
      });
      throw error;
    }
  }
};

export default notificationService;
