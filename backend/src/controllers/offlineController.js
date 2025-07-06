const OfflineService = require('../services/offlineService');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

exports.downloadCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        // Validate inputs
        if (!isValidObjectId(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID format' });
        }

        logger.info(`Downloading course: ${courseId}`);
        const course = await OfflineService.downloadCourse(courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found or not available for download' });
        }

        res.status(200).json({
            courseId: course._id,
            title: course.title,
            downloadUrl: course.downloadUrl,
            expiryDate: course.expiryDate,
            fileSize: course.fileSize,
            format: course.format
        });
    } catch (error) {
        logger.error(`Course download error: ${error.message}`, { stack: error.stack });
        
        if (error.message.includes('not available')) {
            return res.status(403).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to download course',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
