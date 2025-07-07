const { TranslationServiceClient } = require('@google-cloud/translate').v3;
const logger = require('../utils/logger');
const { validateLocalization } = require('../validators/localizationValidator');

const translationClient = new TranslationServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

/**
 * Translate content for localization
 * @param {string|Array} content - Content to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} [context] - Translation context
 * @returns {Promise<string|Array>} Translated content
 */
const translateContent = async (content, targetLanguage, context = 'general') => {
  try {
    const validation = validateLocalization({ content, targetLanguage, context });
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    logger.info(`Localizing content to ${targetLanguage} for ${context} context`);
    
    const isBatch = Array.isArray(content);
    const contents = isBatch ? content : [content];

    if (contents.some(item => item.length > 5000)) {
      throw new Error('Content items must be less than 5000 characters');
    }

    const request = {
      parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
      contents,
      mimeType: 'text/plain',
      sourceLanguageCode: 'auto',
      targetLanguageCode: targetLanguage,
      glossaryConfig: {
        glossary: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global/glossaries/${context}`
      }
    };

    const [response] = await translationClient.translateText(request);
    const translations = response.translations.map(t => t.translatedText);
    
    logger.info('Localization completed successfully');
    return isBatch ? translations : translations[0];
  } catch (error) {
    logger.error(`Localization failed: ${error.message}`);
    
    if (error.details && error.details.includes('Glossary not found')) {
      throw new Error(`No glossary available for ${context} context`);
    }
    
    throw new Error('Failed to localize content');
  }
};

module.exports = { translateContent };
