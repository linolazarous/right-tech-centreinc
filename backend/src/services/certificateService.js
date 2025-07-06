const Certificate = require('../models/Certificate');
const logger = require('../utils/logger');
const { generateCertificateHash } = require('../utils/certificateUtils');

/**
 * Issue a certificate
 * @param {Object} data - Certificate data
 * @returns {Promise<Object>} Issued certificate
 */
exports.issueCertificate = async (data) => {
  try {
    const { userId, courseId, completionDate } = data;

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ userId, courseId });
    if (existingCert) {
      throw new Error('Certificate already issued for this course');
    }

    // Generate certificate hash
    const certificateHash = generateCertificateHash(userId, courseId, completionDate);

    // Create certificate
    const certificate = new Certificate({
      userId,
      courseId,
      issueDate: new Date(),
      completionDate: new Date(completionDate),
      certificateHash,
      status: 'issued'
    });

    await certificate.save();

    logger.info(`Certificate issued for user ${userId}, course ${courseId}`);
    
    return {
      success: true,
      certificate: certificate.toObject({ virtuals: true }),
      downloadUrl: `${process.env.APP_URL}/certificates/${certificate._id}/download`
    };
  } catch (error) {
    logger.error(`Certificate issuance failed: ${error.message}`);
    
    if (error.message.includes('already issued')) {
      throw error; // Re-throw specific error
    }
    
    throw new Error('Failed to issue certificate');
  }
};
