import OpenAI from "openai";
import logger from '../utils/logger.js';
import { validateAdPreferences } from '../validators/adValidator.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate personalized ad content
 * @param {Object} userPreferences - User preferences
 * @returns {Promise<string>} Generated ad content
 */
const generateAdContent = async (userPreferences) => {
  try {
    const validation = validateAdPreferences(userPreferences);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const prompt = `Generate a personalized ad based on these preferences: ${JSON.stringify(userPreferences)}`;
    
    logger.info('Generating ad content with OpenAI');
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    const content = response.choices[0].text.trim();
    logger.info('Successfully generated ad content');
    return content;
  } catch (error) {
    logger.error(`Ad generation failed: ${error.message}`);
    throw new Error('Failed to generate ad content');
  }
};

export { generateAdContent };
