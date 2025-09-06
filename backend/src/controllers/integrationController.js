import integrationService from '../services/integrationService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const integrateGoogleWorkspace = async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Validate inputs
        if (!isValidObjectId(userId)) {
            logger.warn(`Invalid user ID format: ${userId}`);
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        logger.info(`Initiating Google Workspace integration for user: ${userId}`);
        const result = await integrationService.integrateGoogleWorkspace(userId);

        if (!result.success) {
            logger.warn(`Google Workspace integration failed for user: ${userId}`);
            return res.status(400).json(result);
        }

        logger.info(`Google Workspace successfully integrated for user: ${userId}`);
        res.status(200).json({
            success: true,
            userId,
            integrationId: result.integrationId,
            status: 'active',
            connectedServices: result.connectedServices
        });
    } catch (error) {
        logger.error(`Google Workspace integration error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to integrate Google Workspace',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    integrateGoogleWorkspace
};
