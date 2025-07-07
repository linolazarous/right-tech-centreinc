const Subscription = require('../models/Subscription');
const logger = require('../utils/logger');

class SubscriptionService {
  static async createSubscription(subscriptionData) {
    try {
      if (!subscriptionData.userId || !subscriptionData.plan) {
        throw new Error('User ID and plan are required');
      }

      const subscription = new Subscription({
        ...subscriptionData,
        startDate: new Date(),
        status: 'active'
      });

      await subscription.validate();
      const savedSubscription = await subscription.save();
      
      logger.info(`Subscription created for user ${subscriptionData.userId}`);
      return savedSubscription;
    } catch (error) {
      logger.error(`Subscription creation failed: ${error.message}`);
      throw new Error('Failed to create subscription');
    }
  }

  static async getSubscriptions(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const subscriptions = await Subscription.find({ userId })
        .sort({ startDate: -1 })
        .lean();

      return subscriptions;
    } catch (error) {
      logger.error(`Failed to fetch subscriptions: ${error.message}`);
      throw new Error('Failed to retrieve subscriptions');
    }
  }
}

module.exports = SubscriptionService;
