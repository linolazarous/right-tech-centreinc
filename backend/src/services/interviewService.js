const OpenAI = require("openai");
const logger = require('../utils/logger');
const { validateInterviewRequest } = require('../validators/interviewValidator');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate interview questions for a job role
 * @param {string} jobRole - Job role
 * @param {string} difficulty - Question difficulty level
 * @param {number} count - Number of questions
 * @returns {Promise<Array>} Generated questions
 */
const generateInterviewQuestions = async (jobRole, difficulty = 'medium', count = 5) => {
  try {
    const validation = validateInterviewRequest({ jobRole, difficulty, count });
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info(`Generating interview questions for ${jobRole}`);
    
    const prompt = `Generate ${count} ${difficulty} level interview questions for a ${jobRole} position. 
      Format as a numbered list with clear questions.`;
    
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: 300,
      temperature: 0.7,
    });

    const content = response.choices[0].text.trim();
    const questions = content.split('\n').filter(q => q.trim().length > 0);
    
    logger.info(`Generated ${questions.length} questions for ${jobRole}`);
    return {
      jobRole,
      difficulty,
      count: questions.length,
      questions
    };
  } catch (error) {
    logger.error(`Question generation failed: ${error.message}`);
    throw error;
  }
};

/**
 * Simulate interview and provide feedback
 * @param {string} jobRole - Job role
 * @param {Array} userResponses - User responses
 * @returns {Promise<Object>} Interview feedback
 */
const simulateInterview = async (jobRole, userResponses) => {
  try {
    if (!Array.isArray(userResponses) || userResponses.length === 0) {
      throw new Error('Invalid user responses');
    }

    logger.info(`Simulating interview for ${jobRole}`);
    
    const prompt = `You are conducting a mock interview for a ${jobRole} position. 
      Here are the candidate's responses to interview questions: ${JSON.stringify(userResponses)}.
      Provide detailed feedback on their responses, highlighting strengths and areas for improvement.`;
    
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: 500,
      temperature: 0.5,
    });

    const feedback = response.choices[0].text.trim();
    
    logger.info(`Interview simulation completed for ${jobRole}`);
    return {
      jobRole,
      feedback,
      evaluatedAt: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Interview simulation failed: ${error.message}`);
    throw error;
  }
};

module.exports = { generateInterviewQuestions, simulateInterview };
