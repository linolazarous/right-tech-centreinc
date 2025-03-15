const analyticsService = require('../services/analyticsService');

exports.getStudentProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        const progress = await analyticsService.getStudentProgress(userId);
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEngagementMetrics = async (req, res) => {
    try {
        const { userId } = req.params;
        const metrics = await analyticsService.getEngagementMetrics(userId);
        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};