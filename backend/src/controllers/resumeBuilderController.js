import resumeBuilderService from '../services/resumeBuilderService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

export const generateResume = async (req, res) => {
    try {
        const { userId } = req.params;
        const { template = 'professional', format = 'pdf' } = req.query;
        
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const validTemplates = ['professional', 'modern', 'creative', 'academic'];
        if (!validTemplates.includes(template)) {
            return res.status(400).json({ error: 'Invalid template' });
        }

        const validFormats = ['pdf', 'docx', 'txt'];
        if (!validFormats.includes(format)) {
            return res.status(400).json({ error: 'Invalid format' });
        }

        logger.info(`Generating ${template} resume in ${format} format for user: ${userId}`);
        const resume = await resumeBuilderService.generateResume(userId, template, format);

        res.status(200).json({
            userId,
            template,
            format,
            downloadUrl: resume.downloadUrl,
            expiresAt: resume.expiresAt,
            fileSize: resume.fileSize,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        logger.error(`Resume generation error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to generate resume',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    generateResume
};
