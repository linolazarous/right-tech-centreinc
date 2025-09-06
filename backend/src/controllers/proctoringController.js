import proctoringService from '../services/proctoringService.js';
import logger from '../utils/logger.js';

export const monitorExam = async (req, res) => {
    try {
        const { examId, userId, videoStream } = req.body;
        
        // Validate inputs
        if (!examId || typeof examId !== 'string') {
            return res.status(400).json({ error: 'Valid exam ID is required' });
        }

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Valid user ID is required' });
        }

        if (!videoStream || typeof videoStream !== 'string') {
            return res.status(400).json({ error: 'Valid video stream is required' });
        }

        logger.info(`Starting exam monitoring for user: ${userId}, exam: ${examId}`);
        const result = await proctoringService.monitorExam({
            examId,
            userId,
            videoStream,
            timestamp: new Date()
        });

        res.status(200).json({
            examId,
            userId,
            monitoringSessionId: result.sessionId,
            status: result.status,
            warnings: result.warnings || [],
            startedAt: result.startedAt
        });
    } catch (error) {
        logger.error(`Proctoring error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to monitor exam',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    monitorExam
};
