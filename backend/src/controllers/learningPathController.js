const learningPathService = require('../services/learningPathService');

exports.getLearningPath = async (req, res) => {
    try {
        const { userId } = req.params;
        const path = await learningPathService.getLearningPath(userId);
        res.status(200).json(path);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};