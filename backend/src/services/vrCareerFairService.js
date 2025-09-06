import axios from 'axios';
import logger from '../utils/logger.js';

class VRCareerFairService {
  static async createVREvent(eventName, eventDetails) {
    try {
      if (!eventName || !eventDetails) {
        throw new Error('Event name and details are required');
      }

      const apiKey = process.env.VR_API_KEY;
      if (!apiKey) {
        throw new Error('VR API key not configured');
      }

      const response = await axios.post(
        'https://api.vrplatform.com/v1/events',
        {
          name: eventName,
          details: eventDetails,
          createdBy: 'right-tech-center',
          createdAt: new Date().toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      logger.info(`VR event ${eventName} created`);
      return response.data;
    } catch (error) {
      logger.error(`VR event creation failed: ${error.message}`);
      
      if (error.response) {
        throw new Error(`VR platform error: ${error.response.data.message}`);
      }
      
      throw new Error('Failed to create VR event');
    }
  }
}

export default VRCareerFairService;
