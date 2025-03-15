const TranslationService = require('../services/translationService');

    exports.translateText = async (req, res) => {
        try {
            const translatedText = await TranslationService.translateText(req.body.text, req.body.targetLanguage);
            res.status(200).json({ translatedText });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };