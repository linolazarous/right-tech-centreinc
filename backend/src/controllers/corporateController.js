const corporateTrainingService = require('../services/corporateTrainingService');

exports.createTraining = async (req, res) => {
    try {
        const training = await corporateTrainingService.createTraining(req.body);
        res.status(201).json(training);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};