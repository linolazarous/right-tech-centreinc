import aiContentGenerator from '../services/aiContentGenerator.js';
import logger from '../utils/logger.js';

export const generateCourseContent = async (req, res) => {
  try {
    const { topic, audience, difficulty } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic is required.' });
    }

    logger.info(`Generating course content for topic: ${topic}, audience: ${audience || 'unspecified'}`);

    const content = await aiContentGenerator.generateCourseContent({ topic, audience, difficulty });

    res.status(200).json({ success: true, data: content });
  } catch (error) {
    logger.error(`Error generating course content: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to generate course content.' });
  }
};
