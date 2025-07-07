const axios = require('axios');
const logger = require('../utils/logger');

class VRLearningService {
  static async createVRLesson(lessonName, vrContent) {
    try {
      if (!lessonName || !vrContent) {
        throw new Error('Lesson name and content are required');
      }

      const apiKey = process.env.VR_API_KEY;
      if (!apiKey) {
        throw new Error('VR API key not configured');
      }

      const response = await axios.post(
        'https://api.vrplatform.com/v1/lessons',
        {
          name: lessonName,
          content: vrContent,
          metadata: {
            createdBy: 'right-tech-center',
            createdAt: new Date().toISOString()
          }
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      logger.info(`VR lesson ${lessonName} created`);
      return response.data;
    } catch (error) {
      logger.error(`VR lesson creation failed: ${error.message}`);
      
      if (error.response) {
        throw new Error(`VR platform error: ${error.response.data.message}`);
      }
      
      throw new Error('Failed to create VR lesson');
    }
  }
}

module.exports = VRLearningService;
