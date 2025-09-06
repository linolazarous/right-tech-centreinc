import TranslationService from '../services/translationService.js';
import logger from '../utils/logger.js';
import { supportedLanguages } from '../config/languages.js';

export const translateText = async (req, res) => {
    try {
        const { text, targetLanguage, sourceLanguage } = req.body;
        
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

        if (sourceLanguage && !supportedLanguages.includes(sourceLanguage)) {
            return res.status(400).json({ 
                error: 'Unsupported source language',
                supportedLanguages
            });
        }

        if (text.length > 5000) {
            return res.status(400).json({ error: 'Text exceeds maximum length of 5000 characters' });
        }

        logger.info(`Translating text to ${targetLanguage}`);
        const translatedText = await TranslationService.translateText(
            text, 
            targetLanguage, 
            sourceLanguage
        );

        res.status(200).json({ 
            originalText: text,
            translatedText,
            sourceLanguage: sourceLanguage || 'auto',
            targetLanguage,
            characterCount: text.length,
            translatedAt: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Translation error: ${error.message}`, { stack: error.stack });
        
        if (error.message.includes('Language not supported')) {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to translate text',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Add endpoint to get supported languages
export const getSupportedLanguages = async (req, res) => {
    res.status(200).json({ 
        supportedLanguages,
        lastUpdated: '2025-01-01'
    });
};

export default {
    translateText,
    getSupportedLanguages
};
