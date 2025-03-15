const blockchainService = require('../services/blockchainService');

exports.issueCertificate = async (req, res) => {
    try {
        const { studentAddress, courseId, certificateHash } = req.body;
        const result = await blockchainService.issueCertificate(studentAddress, courseId, certificateHash);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};