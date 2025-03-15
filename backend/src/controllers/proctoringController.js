const proctoringService = require('../services/proctoringService');

exports.monitorExam = async (req, res) => {
    try {
        const result = await proctoringService.monitorExam(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};