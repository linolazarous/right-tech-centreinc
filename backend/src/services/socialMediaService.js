import axios from 'axios';
import logger from '../utils/logger.js';

class SocialMediaService {
  static async postToSocialMedia(platform, content) {
    try {
      if (!platform || !content) {
        throw new Error('Platform and content are required');
      }

      const apiKey = process.env[`${platform.toUpperCase()}_API_KEY`];
      if (!apiKey) {
        throw new Error(`API key not configured for ${platform}`);
      }

      const url = `https://api.${platform}.com/v1/posts`;
      const response = await axios.post(
        url,
        { content },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      logger.info(`Content posted to ${platform}`);
      return response.data;
    } catch (error) {
      logger.error(`Social media post failed: ${error.message}`);
      
      if (error.response) {
        // Handle platform-specific errors
        throw new Error(`Social media API error: ${error.response.data.message}`);
      }
      
      throw new Error('Failed to post to social media');
    }
  }
}

export default SocialMediaService;
