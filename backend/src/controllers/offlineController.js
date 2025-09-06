import OfflineService from '../services/offlineService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const downloadCourse = async (req, res) => {
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

export const getDownloadableCourses = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        logger.info(`Fetching downloadable courses for user: ${userId}`);
        const courses = await OfflineService.getDownloadableCourses(userId);

        res.status(200).json({
            userId,
            count: courses.length,
            courses,
            retrievedAt: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Downloadable courses error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to get downloadable courses',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const removeDownloadedCourse = async (req, res) => {
    try {
        const { courseId, userId } = req.body;
        
        // Validate inputs
        if (!isValidObjectId(courseId) || !isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid course ID or user ID format' });
        }

        logger.info(`Removing downloaded course: ${courseId} for user: ${userId}`);
        const result = await OfflineService.removeDownloadedCourse(courseId, userId);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.status(200).json({
            success: true,
            message: 'Course removed from downloads',
            courseId,
            userId
        });
    } catch (error) {
        logger.error(`Remove downloaded course error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to remove downloaded course',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    downloadCourse,
    getDownloadableCourses,
    removeDownloadedCourse
};
