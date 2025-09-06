import { translateText } from "../services/languageSwitcherService.js";
import logger from '../utils/logger.js';
import { supportedLanguages } from '../config/languages.js';

export const translate = async (req, res) => {
    const { text, targetLanguage } = req.body;
    
    try {
        // Validate inputs
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Text to translate is required' });
        }

        if (!targetLanguage || !supportedLanguages.includes(targetLanguage)) {
            return res.status(400).json({ 
                error: 'Unsupported target language',
                supportedLanguages
            });
        }

        if (text.length > 5000) {
            return res.status(400).json({ error: 'Text too long (max 5000 characters)' });
        }

        logger.info(`Translating text to ${targetLanguage}`);
        const translatedText = await translateText(text, targetLanguage);

        res.status(200).json({ 
            originalText: text,
            translatedText,
            targetLanguage,
            characterCount: text.length,
            translatedAt: new Date().toISOString()
        });
    } catch (err) {
        logger.error(`Translation error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to translate text',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export const getSupportedLanguages = (req, res) => res.status(200).json({ supportedLanguages });

export default { 
    translate,
    getSupportedLanguages
};
