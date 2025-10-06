import blockchainService from '../services/blockchainService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const issueCertificate = async (req, res) => {
    try {
        const { studentAddress, courseId, certificateHash } = req.body;

        if (!/^0x[a-fA-F0-9]{40}$/.test(studentAddress)) {
            return res.status(400).json({ success: false, error: 'Invalid Ethereum address format' });
        }

        if (!isValidObjectId(courseId)) {
            return res.status(400).json({ success: false, error: 'Invalid course ID format' });
        }

        if (typeof certificateHash !== 'string' || !certificateHash.trim()) {
            return res.status(400).json({ success: false, error: 'Invalid or empty certificate hash' });
        }

        logger.info(`⛓️ Issuing blockchain certificate for course: ${courseId}, student: ${studentAddress}`);

        const result = await blockchainService.issueCertificate(studentAddress, courseId, certificateHash);

        if (!result.success) {
            logger.warn(`⚠️ Blockchain certificate issuance failed: ${result.message}`);
            return res.status(400).json(result);
        }

        logger.info(`✅ Blockchain certificate issued. TX: ${result.txHash}`);

        return res.status(200).json({
            success: true,
            message: 'Certificate issued successfully',
            transactionHash: result.txHash,
            blockNumber: result.blockNumber,
            certificateId: result.certificateId,
            timestamp: result.timestamp
        });
    } catch (error) {
        logger.error(`❌ Error issuing certificate: ${error.message}`, { stack: error.stack });
        return res.status(500).json({
            success: false,
            error: 'Failed to issue certificate on blockchain',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
};

export default { issueCertificate };
