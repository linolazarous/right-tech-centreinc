const { moderateContent } = require("../services/moderationService");
const logger = require('../utils/logger');

const moderate = async (req, res) => {
    const { content, contentType = 'text' } = req.body;
    
    try {
        // Validate inputs
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const validTypes = ['text', 'image', 'video'];
        if (!validTypes.includes(contentType)) {
            return res.status(400).json({ error: 'Invalid content type' });
        }

        if (contentType === 'text' && typeof content !== 'string') {
            return res.status(400).json({ error: 'Text content must be a string' });
        }

        logger.info(`Moderating ${contentType} content`);
        const moderationResult = await moderateContent(content, contentType);

        res.status(200).json({ 
            contentType,
            isApproved: moderationResult.approved,
            flags: moderationResult.flags,
            score: moderationResult.score,
            moderatedAt: new Date().toISOString()
        });
    } catch (err) {
        logger.error(`Moderation error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to moderate content',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = { 
    moderate 
};
