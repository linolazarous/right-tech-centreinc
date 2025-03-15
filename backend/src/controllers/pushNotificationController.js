const pushNotificationService = require('../services/pushNotificationService');

exports.sendNotification = async (req, res) => {
    try {
        const { userId, message } = req.body;
        const result = await pushNotificationService.sendNotification(userId, message);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};