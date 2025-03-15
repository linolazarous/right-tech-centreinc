const scholarshipService = require('../services/scholarshipService');

exports.allocateScholarship = async (req, res) => {
    try {
        const { studentId, criteria } = req.body;
        const result = await scholarshipService.allocateScholarship(studentId, criteria);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};