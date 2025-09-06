import { createSubscription, getSubscriptions } from "../services/subscriptionService.js";
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';
import { validateSubscription } from '../validators/subscriptionValidator.js';

export const subscribe = async (req, res) => {
    const { userId, plan, duration } = req.body;
    
    try {
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const validation = validateSubscription({ plan, duration });
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        logger.info(`Creating subscription for user: ${userId}, plan: ${plan}`);
        const subscription = await createSubscription({ 
            userId, 
            plan, 
            duration: parseInt(duration)
        });

        res.status(201).json({
            subscriptionId: subscription._id,
            userId: subscription.userId,
            plan: subscription.plan,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate
        });
    } catch (err) {
        logger.error(`Subscription error: ${err.message}`, { stack: err.stack });
        
        if (err.message.includes('already has an active subscription')) {
            return res.status(409).json({ error: err.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to create subscription',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export const getUserSubscriptions = async (req, res) => {
    const { userId } = req.params;
    
    try {
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        logger.info(`Fetching subscriptions for user: ${userId}`);
        const subscriptions = await getSubscriptions(userId);

        res.status(200).json({
            userId,
            activeSubscriptions: subscriptions.filter(s => s.status === 'active'),
            expiredSubscriptions: subscriptions.filter(s => s.status === 'expired'),
            cancelledSubscriptions: subscriptions.filter(s => s.status === 'cancelled'),
            total: subscriptions.length
        });
    } catch (err) {
        logger.error(`Subscriptions fetch error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to fetch subscriptions',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export default { 
    subscribe, 
    getUserSubscriptions 
};
