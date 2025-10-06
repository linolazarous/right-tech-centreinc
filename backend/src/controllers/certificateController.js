import CertificateModel from '../models/certificateModel.js';
import logger from '../utils/logger.js';

export const generateCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      return res.status(400).json({ success: false, error: 'userId and courseId are required.' });
    }

    const certificate = await CertificateModel.create({
      userId,
      courseId,
      issuedDate: new Date(),
      downloadUrl: `/certificates/${userId}-${courseId}.pdf`,
    });

    logger.info(`Certificate generated for user ${userId} on course ${courseId}`);

    res.status(201).json({
      success: true,
      data: {
        certificateId: certificate._id,
        userId: certificate.userId,
        courseId: certificate.courseId,
        issueDate: certificate.issuedDate,
        downloadUrl: certificate.downloadUrl,
      },
    });
  } catch (error) {
    logger.error(`Error generating certificate: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to generate certificate.' });
  }
};
