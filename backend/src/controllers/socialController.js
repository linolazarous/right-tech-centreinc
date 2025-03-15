const socialService = require('../services/socialService');

exports.createStudyGroup = async (req, res) => {
    try {
        const group = await socialService.createStudyGroup(req.body);
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStudyGroups = async (req, res) => {
    try {
        const groups = await socialService.getStudyGroups();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};