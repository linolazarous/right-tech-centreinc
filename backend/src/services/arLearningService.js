const axios = require('axios');
const logger = require('../utils/logger');
const { validateARContent } = require('../validators/arValidator');

/**
 * Create an AR lesson
 * @param {string} lessonName - Lesson name
 * @param {Object} arContent - AR content data
 * @returns {Promise<Object>} Created lesson
 */
const createARLesson = async (lessonName, arContent) => {
  try {
    const validation = validateARContent(arContent);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info(`Creating AR lesson: ${lessonName}`);
    const response = await axios.post(
      "https://api.arplatform.com/v1/lessons",
      {
        name: lessonName,
        content: arContent,
        metadata: {
          createdAt: new Date().toISOString(),
          createdBy: 'system'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AR_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    logger.info(`AR lesson created: ${response.data.id}`);
    return response.data;
  } catch (error) {
    logger.error(`AR lesson creation failed: ${error.message}`);
    
    if (error.response) {
      // Handle API error response
      throw new Error(`AR platform error: ${error.response.data.message}`);
    }
    
    throw new Error('Failed to create AR lesson');
  }
};

module.exports = { createARLesson };
