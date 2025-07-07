const OpenAI = require("openai");
const logger = require('../utils/logger');
const { validateModerationInput } = require('../validators/moderationValidator');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Moderate content for inappropriate material
 * @param {string} content - Content to moderate
 * @param {string} [contentType] - Content type (text, image, video)
 * @returns {Promise<Object>} Moderation result
 */
const moderateContent = async (content, contentType = 'text') => {
  try {
    const validation = validateModerationInput({ content, contentType });
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info(`Moderating ${contentType} content`);
    
    let result;
    
    if (contentType === 'text') {
      const response = await openai.moderations.create({
        input: content,
        model: "text-moderation-latest"
      });

      const moderation = response.results[0];
      result = {
        approved: !moderation.flagged,
        flagged: moderation.flagged,
        categories: moderation.categories,
        scores: moderation.category_scores
      };
    } else {
      // For non-text content, use a different moderation approach
      result = {
        approved: true,
        flagged: false,
        note: 'Non-text content moderation not fully implemented'
      };
    }

    logger.info(`Moderation completed: ${result.approved ? 'approved' : 'flagged'}`);
    return result;
  } catch (error) {
    logger.error(`Content moderation failed: ${error.message}`);
    throw error;
  }
};

module.exports = { moderateContent };
