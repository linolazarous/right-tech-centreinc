import codingChallengeService from '../services/codingChallengeService.js';
import logger from '../utils/logger.js';

export const getCodingChallenges = async (req, res) => {
    try {
        const { difficulty, language, limit = 20 } = req.query;
        
        // Validate query parameters
        if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
            return res.status(400).json({ error: 'Invalid difficulty level' });
        }

        if (limit && (isNaN(limit) || limit < 1 || limit > 50)) {
            return res.status(400).json({ error: 'Limit must be between 1 and 50' });
        }

        logger.info('Fetching coding challenges', { difficulty, language });
        const challenges = await codingChallengeService.getCodingChallenges({
            difficulty,
            language,
            limit: parseInt(limit)
        });

        res.status(200).json({
            count: challenges.length,
            filters: { difficulty, language },
            challenges
        });
    } catch (error) {
        logger.error(`Error getting coding challenges: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to retrieve coding challenges',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    getCodingChallenges
};
