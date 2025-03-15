const jobPortalService = require('../services/jobPortalService');

exports.getJobRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;
        const jobs = await jobPortalService.getJobRecommendations(userId);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};