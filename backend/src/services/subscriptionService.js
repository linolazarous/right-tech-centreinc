const Subscription = require("../models/Subscription");

const createSubscription = async ({ userId, plan, duration }) => {
  const subscription = await Subscription.create({ userId, plan, duration });
  return subscription;
};

const getSubscriptions = async (userId) => {
  const subscriptions = await Subscription.findAll({ where: { userId } });
  return subscriptions;
};

module.exports = { createSubscription, getSubscriptions };