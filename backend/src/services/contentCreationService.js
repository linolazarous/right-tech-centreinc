const OpenAI = require("openai");
const Course = require('../models/Course');
const logger = require('../utils/logger');
const { validateTopic } = require('../validators/contentValidator');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate course content using AI
 * @param {string} topic - Course topic
 * @param {string} audience - Target audience
 * @param {string} depth - Content depth level
 * @returns {Promise<Object>} Generated course content
 */
const generateCourseContent = async ({ topic, audience = 'beginners', depth = 'intermediate' }) => {
  try {
    const validation = validateTopic(topic);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info(`Generating course content for topic: ${topic}`);
    
    const prompt = `Create a detailed course outline on ${topic} for ${audience} with ${depth} depth. 
      Include learning objectives, module breakdown, and key concepts.`;
    
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0].text.trim();
    
    // Parse and structure the generated content
    const structuredContent = this.parseGeneratedContent(content);
    
    logger.info('Successfully generated course content');
    return {
      topic,
      audience,
      depth,
      content: structuredContent,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Course content generation failed: ${error.message}`);
    throw new Error('Failed to generate course content');
  }
};

/**
 * Parse AI-generated content into structured format
 * @param {string} content - Raw generated content
 * @returns {Object} Structured content
 */
parseGeneratedContent = (content) => {
  // Basic parsing logic - would be more sophisticated in production
  const sections = content.split('\n\n');
  const result = {
    objectives: [],
    modules: []
  };

  sections.forEach(section => {
    if (section.startsWith('Learning Objectives:')) {
      result.objectives = section.split('\n').slice(1);
    } else if (section.startsWith('Module')) {
      result.modules.push({
        title: section.split('\n')[0],
        content: section.split('\n').slice(1).join('\n')
      });
    }
  });

  return result;
};

module.exports = { generateCourseContent };
