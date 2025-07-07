const axios = require('axios');
const logger = require('../utils/logger');

// Configure Zoom client with environment variables
const zoomClient = axios.create({
  baseURL: 'https://api.zoom.us/v2',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.ZOOM_JWT_TOKEN}`
  },
  timeout: 5000
});

class ZoomService {
  static async scheduleMeeting(meetingData) {
    try {
      // Validate required fields
      if (!meetingData.topic || !meetingData.start_time || !meetingData.duration) {
        throw new Error('Topic, start time, and duration are required');
      }

      // Validate start time is in the future
      const startTime = new Date(meetingData.start_time);
      if (startTime < new Date()) {
        throw new Error('Start time must be in the future');
      }

      // Set default meeting settings
      const payload = {
        topic: meetingData.topic,
        type: 2, // Scheduled meeting
        start_time: startTime.toISOString(),
        duration: Math.min(Math.max(meetingData.duration, 15), // Clamp between 15-240
        timezone: meetingData.timezone || 'UTC',
        password: meetingData.password || this.generateRandomPassword(),
        settings: {
          host_video: meetingData.settings?.host_video || false,
          participant_video: meetingData.settings?.participant_video || false,
          join_before_host: meetingData.settings?.join_before_host || false,
          mute_upon_entry: meetingData.settings?.mute_upon_entry || false,
          waiting_room: meetingData.settings?.waiting_room || true,
          ...meetingData.settings
        }
      };

      const response = await zoomClient.post('/users/me/meetings', payload);
      
      logger.info(`Zoom meeting scheduled: ${response.data.id}`);
      return response.data;
    } catch (error) {
      logger.error(`Zoom meeting scheduling failed: ${error.message}`);
      
      if (error.response) {
        const zoomError = error.response.data;
        throw new Error(`Zoom API error: ${zoomError.message}`);
      }
      
      throw new Error('Failed to schedule Zoom meeting');
    }
  }

  static generateRandomPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

module.exports = ZoomService;
