import integrationService from '../services/integrationService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const integrateGoogleWorkspace = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID format' });
    }

    logger.info(`Integrating Google Workspace for user ${userId}`);
    const result = await integrationService.integrateGoogleWorkspace(userId);

    if (!result.success) {
      logger.warn(`Integration failed for user ${userId}`);
      return res.status(400).json({ success: false, ...result });
    }

    res.status(200).json({
      success: true,
      data: {
        userId,
        integrationId: result.integrationId,
        status: 'active',
        connectedServices: result.connectedServices
      }
    });
  } catch (error) {
    logger.error(`Integration error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      error: 'Failed to integrate Google Workspace',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default { integrateGoogleWorkspace };
