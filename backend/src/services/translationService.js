const { TranslationServiceClient } = require('@google-cloud/translate').v3;
const logger = require('../utils/logger');

const translationClient = new TranslationServiceClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

class TranslationService {
  static async translateText(text, targetLanguage, sourceLanguage = 'en') {
    try {
      if (!text || !targetLanguage) {
        throw new Error('Text and target language are required');
      }

      const request = {
        parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
        contents: [text],
        mimeType: 'text/plain',
        sourceLanguageCode: sourceLanguage,
        targetLanguageCode: targetLanguage,
      };

      const [response] = await translationClient.translateText(request);
      if (!response.translations || response.translations.length === 0) {
        throw new Error('No translation returned from API');
      }

      logger.info(`Text translated to ${targetLanguage}`);
      return response.translations[0].translatedText;
    } catch (error) {
      logger.error(`Translation failed: ${error.message}`);
      throw new Error('Failed to translate text');
    }
  }
}

module.exports = TranslationService;
