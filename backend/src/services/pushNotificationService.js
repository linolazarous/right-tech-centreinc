import admin from 'firebase-admin';
import User from '../models/User.js';
import logger from '../utils/logger.js';

// Initialize Firebase Admin SDK with environment variables
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

class PushNotificationService {
  static async sendNotification(userId, message, metadata = {}) {
    try {
      if (!userId || !message) {
        throw new Error('User ID and message are required');
      }

      const user = await User.findById(userId).select('fcmToken');
      if (!user || !user.fcmToken) {
        logger.warn(`User ${userId} has no FCM token registered`);
        return false;
      }

      const messagePayload = {
        token: user.fcmToken,
        notification: {
          title: metadata.title || 'Right Tech Centre',
          body: message,
        },
        data: metadata.data || {},
      };

      await admin.messaging().send(messagePayload);
      logger.info(`Notification sent to user ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Notification failed for user ${userId}: ${error.message}`);
      
      // Handle invalid token errors
      if (error.code === 'messaging/invalid-registration-token' || 
          error.code === 'messaging/registration-token-not-registered') {
        await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
        logger.info(`Removed invalid FCM token for user ${userId}`);
      }
      
      throw new Error('Failed to send notification');
    }
  }
}

export default PushNotificationService;
