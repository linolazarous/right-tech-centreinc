// src/controllers/arvrController.js
import arvrService from '../services/arvrService.js';
import { logger } from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const generateARVRContent = async (req, res) => {
  try {
    const { courseId, options = {} } = req.body;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }
    if (options && typeof options !== 'object') {
      return res.status(400).json({ success: false, message: 'Options must be an object' });
    }

    const result = await arvrService.generateARVRContent(courseId, options);
    if (!result || result.success === false) {
      logger.warn('AR/VR generation returned unsuccessful result', { courseId });
      return res.status(422).json({ success: false, message: result?.message || 'AR/VR generation failed' });
    }

    return res.status(200).json({
      success: true,
      contentId: result.contentId,
      previewUrl: result.previewUrl,
      estimatedSize: result.estimatedSize
    });
  } catch (err) {
    logger.error('Error generating AR/VR content', { message: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export default { generateARVRContent };
