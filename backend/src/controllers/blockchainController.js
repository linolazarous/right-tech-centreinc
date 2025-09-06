import blockchainService from '../services/blockchainService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const issueCertificate = async (req, res) => {
    try {
        const { studentAddress, courseId, certificateHash } = req.body;
        
        // Validate inputs
        if (!studentAddress || !studentAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            return res.status(400).json({ error: 'Invalid Ethereum address' });
        }

        if (!isValidObjectId(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID format' });
        }

        if (!certificateHash || typeof certificateHash !== 'string') {
            return res.status(400).json({ error: 'Invalid certificate hash' });
        }

        logger.info(`Issuing blockchain certificate for course: ${courseId}, student: ${studentAddress}`);
        const result = await blockchainService.issueCertificate(studentAddress, courseId, certificateHash);
        
        if (!result.success) {
            logger.error(`Blockchain certificate issuance failed: ${result.message}`);
            return res.status(400).json(result);
        }

        logger.info(`Successfully issued blockchain certificate. TX hash: ${result.txHash}`);
        res.status(200).json({
            success: true,
            transactionHash: result.txHash,
            blockNumber: result.blockNumber,
            certificateId: result.certificateId,
            timestamp: result.timestamp
        });
    } catch (error) {
        logger.error(`Error issuing blockchain certificate: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to issue certificate on blockchain',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    issueCertificate
};
