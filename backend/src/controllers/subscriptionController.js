const { createSubscription, getSubscriptions } = require("../services/subscriptionService");

const subscribe = async (req, res) => {
  const { userId, plan, duration } = req.body;
  try {
    const subscription = await createSubscription({ userId, plan, duration });
    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserSubscriptions = async (req, res) => {
  const { userId } = req.params;
  try {
    const subscriptions = await getSubscriptions(userId);
    res.status(200).json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { subscribe, getUserSubscriptions };