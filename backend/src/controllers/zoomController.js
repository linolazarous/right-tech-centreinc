const zoom = require('../services/zoomService');
const logger = require('../utils/logger');
const { validateZoomMeeting } = require('../validators/zoomValidator');

exports.scheduleMeeting = async (req, res) => {
    try {
        const meetingData = req.body;
        
        // Validate inputs
        const validation = validateZoomMeeting(meetingData);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        logger.info(`Scheduling Zoom meeting: ${meetingData.topic}`);
        const meeting = await zoom.scheduleMeeting(meetingData);

        res.status(201).json({
            meetingId: meeting.id,
            topic: meeting.topic,
            startTime: meeting.start_time,
            duration: meeting.duration,
            joinUrl: meeting.join_url,
            password: meeting.password,
            createdBy: meeting.host_email,
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Zoom meeting error: ${error.message}`, { stack: error.stack });
        
        if (error.response) {
            const { status, data } = error.response;
            return res.status(status).json({ 
                error: 'Zoom API error',
                details: data 
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to schedule meeting',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
