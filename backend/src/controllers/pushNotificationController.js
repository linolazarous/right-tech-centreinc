import pushNotificationService from '../services/pushNotificationService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const sendNotification = async (req, res) => {
    try {
        const { userId, message, data = {}, priority = 'normal' } = req.body;
        
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Valid message is required' });
        }

        if (!['normal', 'high'].includes(priority)) {
            return res.status(400).json({ error: 'Invalid priority value' });
        }

        logger.info(`Sending push notification to user: ${userId}`);
        const result = await pushNotificationService.sendNotification({
            userId,
            message,
            data,
            priority
        });

        if (!result.success) {
            logger.warn(`Push notification failed for user: ${userId}`);
            return res.status(400).json(result);
        }

        res.status(200).json({
            userId,
            notificationId: result.notificationId,
            status: 'delivered',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Push notification error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to send notification',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    sendNotification
};
