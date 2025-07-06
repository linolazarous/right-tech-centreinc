const { TranslationServiceClient } = require('@google-cloud/translate').v3;
const logger = require('../utils/logger');
const { validateTranslation } = require('../validators/languageValidator');

const translationClient = new TranslationServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

/**
 * Translate text using Google Cloud Translation
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} [sourceLanguage] - Source language code (optional)
 * @returns {Promise<string>} Translated text
 */
const translateText = async (text, targetLanguage, sourceLanguage = 'en') => {
  try {
    const validation = validateTranslation({ text, targetLanguage });
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    if (text.length > 5000) {
      throw new Error('Text exceeds maximum length of 5000 characters');
    }

    logger.info(`Translating text to ${targetLanguage}`);
    
    const request = {
      parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: sourceLanguage,
      targetLanguageCode: targetLanguage,
    };

    const [response] = await translationClient.translateText(request);
    const translation = response.translations[0].translatedText;
    
    logger.info('Translation completed successfully');
    return translation;
  } catch (error) {
    logger.error(`Translation failed: ${error.message}`);
    
    if (error.details && error.details.includes('Invalid target language')) {
      throw new Error('Unsupported target language');
    }
    
    throw new Error('Failed to translate text');
  }
};

module.exports = { translateText };
