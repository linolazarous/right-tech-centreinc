import { createVirtualCampus } from "../services/metaverseService.js";
import logger from '../utils/logger.js';

export const createCampus = async (req, res) => {
    const { campusName, template = 'default', capacity = 100 } = req.body;
    
    try {
        // Validate inputs
        if (!campusName || typeof campusName !== 'string') {
            return res.status(400).json({ error: 'Valid campus name is required' });
        }

        const validTemplates = ['default', 'modern', 'futuristic', 'minimalist'];
        if (!validTemplates.includes(template)) {
            return res.status(400).json({ error: 'Invalid template' });
        }

        if (isNaN(capacity) || capacity < 10 || capacity > 1000) {
            return res.status(400).json({ error: 'Capacity must be 10-1000' });
        }

        logger.info(`Creating virtual campus: ${campusName}`);
        const campus = await createVirtualCampus({
            name: campusName,
            template,
            capacity: parseInt(capacity)
        });

        res.status(201).json({
            campusId: campus._id,
            campusName: campus.name,
            template: campus.template,
            capacity: campus.capacity,
            accessUrl: campus.accessUrl,
            createdAt: campus.createdAt
        });
    } catch (err) {
        logger.error(`Virtual campus creation error: ${err.message}`, { stack: err.stack });
        
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Campus name already exists' });
        }
        
        res.status(500).json({ 
            error: 'Failed to create virtual campus',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export default { 
    createCampus 
};
