const CertificateService = require('../services/certificateService');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

exports.issueCertificate = async (req, res) => {
    try {
        const { userId, courseId, completionDate } = req.body;
        
        // Validate inputs
        if (!isValidObjectId(userId) || !isValidObjectId(courseId)) {
            return res.status(400).json({ error: 'Invalid user ID or course ID format' });
        }

        if (!completionDate || isNaN(Date.parse(completionDate))) {
            return res.status(400).json({ error: 'Invalid completion date' });
        }

        logger.info(`Issuing certificate for user: ${userId}, course: ${courseId}`);
        const certificate = await CertificateService.issueCertificate({
            userId,
            courseId,
            completionDate: new Date(completionDate),
            issuedDate: new Date()
        });

        logger.info(`Certificate issued: ${certificate._id}`);
        res.status(201).json({
            certificateId: certificate._id,
            userId: certificate.userId,
            courseId: certificate.courseId,
            issueDate: certificate.issuedDate,
            downloadUrl: certificate.downloadUrl
        });
    } catch (error) {
        logger.error(`Error issuing certificate: ${error.message}`, { stack: error.stack });
        
        if (error.message.includes('already exists')) {
            return res.status(409).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to issue certificate',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
