import { generateInterviewQuestions, simulateInterview } from "../services/interviewService.js";
import logger from '../utils/logger.js';

export const getInterviewQuestions = async (req, res) => {
  try {
    const { jobRole, difficulty = 'medium', count = 10 } = req.body;

    if (!jobRole || typeof jobRole !== 'string') {
      return res.status(400).json({ success: false, error: 'Job role is required' });
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ success: false, error: 'Invalid difficulty level' });
    }

    if (isNaN(count) || count < 1 || count > 20) {
      return res.status(400).json({ success: false, error: 'Count must be between 1–20' });
    }

    logger.info(`Generating interview questions for ${jobRole}`);
    const questions = await generateInterviewQuestions(jobRole, difficulty, parseInt(count));

    res.status(200).json({
      success: true,
      data: {
        jobRole,
        difficulty,
        count: questions.length,
        questions,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    logger.error(`Interview generation error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ success: false, error: 'Failed to generate questions' });
  }
};

export const conductMockInterview = async (req, res) => {
  try {
    const { jobRole, userResponses } = req.body;

    if (!jobRole || typeof jobRole !== 'string') {
      return res.status(400).json({ success: false, error: 'Job role is required' });
    }

    if (!Array.isArray(userResponses) || userResponses.length === 0) {
      return res.status(400).json({ success: false, error: 'User responses must be a non-empty array' });
    }

    logger.info(`Conducting mock interview for ${jobRole}`);
    const feedback = await simulateInterview(jobRole, userResponses);

    res.status(200).json({
      success: true,
      data: {
        jobRole,
        questionsCount: userResponses.length,
        feedback,
        completedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    logger.error(`Mock interview error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ success: false, error: 'Failed to conduct mock interview' });
  }
};

export default { getInterviewQuestions, conductMockInterview };
