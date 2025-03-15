const arvrService = require('../services/arvrService');

exports.generateARVRContent = async (req, res) => {
    try {
        const { courseId } = req.body;
        const result = await arvrService.generateARVRContent(courseId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};