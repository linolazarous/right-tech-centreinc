const liveQAService = require('../services/liveQAService');
const logger = require('../utils/logger');

exports.scheduleLiveQA = async (req, res) => {
    try {
        const { title, hostId, scheduledTime, duration } = req.body;
        
        // Validate inputs
        if (!title || typeof title !== 'string') {
            return res.status(400).json({ error: 'Valid title is required' });
        }

        if (!hostId || typeof hostId !== 'string') {
            return res.status(400).json({ error: 'Valid host ID is required' });
        }

        if (!scheduledTime || isNaN(Date.parse(scheduledTime))) {
            return res.status(400).json({ error: 'Valid scheduled time is required' });
        }

        if (isNaN(duration) || duration < 15 || duration > 240) {
            return res.status(400).json({ error: 'Duration must be 15-240 minutes' });
        }

        logger.info(`Scheduling live QA session: ${title}`);
        const session = await liveQAService.scheduleLiveQA({
            title,
            hostId,
            scheduledTime: new Date(scheduledTime),
            duration: parseInt(duration),
            status: 'scheduled'
        });

        res.status(201).json({
            sessionId: session._id,
            title: session.title,
            hostId: session.hostId,
            scheduledTime: session.scheduledTime,
            duration: session.duration,
            joinUrl: session.joinUrl
        });
    } catch (error) {
        logger.error(`Live QA scheduling error: ${error.message}`, { stack: error.stack });
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to schedule live QA',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
