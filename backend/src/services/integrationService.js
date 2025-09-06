import User from '../models/User.js';
import logger from '../utils/logger.js';
import { validateUserId } from '../validators/userValidator.js';
import { google } from 'googleapis';

/**
 * Integrate Google Workspace for user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Integration result
 */
export const integrateGoogleWorkspace = async (userId) => {
  try {
    const validation = validateUserId(userId);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info(`Integrating Google Workspace for user ${userId}`);
    
    // Initialize Google OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Generate auth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/gmail.readonly'
      ],
      prompt: 'consent'
    });

    // Save integration state to user
    await User.findByIdAndUpdate(userId, {
      googleIntegration: {
        authUrl,
        status: 'pending'
      }
    });

    logger.info(`Google Workspace integration initiated for user ${userId}`);
    return {
      success: true,
      userId,
      authUrl,
      status: 'pending',
      nextSteps: 'Complete OAuth flow using the provided URL'
    };
  } catch (error) {
    logger.error(`Google Workspace integration failed: ${error.message}`);
    throw error;
  }
};
