import { translateContent } from "../services/localizationService.js";
import logger from '../utils/logger.js';
import { supportedLanguages } from '../config/languages.js';

export const translate = async (req, res) => {
    const { content, targetLanguage, context } = req.body;
    
    try {
        // Validate inputs
        if (!content || (typeof content !== 'string' && !Array.isArray(content))) {
            return res.status(400).json({ error: 'Content must be string or array' });
        }

        if (!targetLanguage || !supportedLanguages.includes(targetLanguage)) {
            return res.status(400).json({ 
                error: 'Unsupported target language',
                supportedLanguages
            });
        }

        logger.info(`Localizing content to ${targetLanguage}`);
        const translatedContent = await translateContent(content, targetLanguage, context);

        res.status(200).json({ 
            original: content,
            translated: translatedContent,
            targetLanguage,
            context: context || 'general',
            localizedAt: new Date().toISOString()
        });
    } catch (err) {
        logger.error(`Localization error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to localize content',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export const getSupportedLanguages = (req, res) => res.status(200).json({ supportedLanguages });

export default { 
    translate,
    getSupportedLanguages
};
