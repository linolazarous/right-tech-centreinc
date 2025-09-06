import { createVREvent } from "../services/vrCareerFairService.js";
import logger from '../utils/logger.js';
import { validateVREvent } from '../validators/vrValidator.js';

export const createEvent = async (req, res) => {
    const { eventName, eventDetails } = req.body;
    
    try {
        // Validate inputs
        const validation = validateVREvent({ eventName, ...eventDetails });
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        logger.info(`Creating VR career event: ${eventName}`);
        const event = await createVREvent(eventName, eventDetails);

        res.status(201).json({
            eventId: event._id,
            eventName: event.name,
            startDate: event.startDate,
            endDate: event.endDate,
            vrWorldId: event.vrWorldId,
            accessUrl: event.accessUrl,
            createdAt: event.createdAt
        });
    } catch (err) {
        logger.error(`VR event creation error: ${err.message}`, { stack: err.stack });
        
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Event with this name already exists' });
        }
        
        res.status(500).json({ 
            error: 'Failed to create VR event',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export default { 
    createEvent 
};
