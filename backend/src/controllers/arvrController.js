const arvrService = require('../services/arvrService');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

exports.generateARVRContent = async (req, res) => {
    try {
        const { courseId, options = {} } = req.body;

        // Validate course ID
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID format' });
        }

        // Validate options if provided
        if (options && typeof options !== 'object') {
            return res.status(400).json({ error: 'Options must be an object' });
        }

        logger.info(`Generating AR/VR content for course: ${courseId}`);
        const result = await arvrService.generateARVRContent(courseId, options);

        if (!result.success) {
            logger.warn(`AR/VR content generation failed for course: ${courseId}`);
            return res.status(422).json(result);
        }

        logger.info(`Successfully generated AR/VR content for course: ${courseId}`);
        res.status(200).json({
            success: true,
            contentId: result.contentId,
            previewUrl: result.previewUrl,
            estimatedSize: result.estimatedSize
        });
    } catch (error) {
        logger.error(`Error generating AR/VR content: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to generate AR/VR content',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
