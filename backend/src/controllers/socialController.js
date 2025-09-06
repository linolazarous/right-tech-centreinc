import socialService from '../services/socialService.js';
import logger from '../utils/logger.js';
import { validateStudyGroup } from '../validators/socialValidator.js';

export const createStudyGroup = async (req, res) => {
    try {
        const groupData = req.body;
        
        // Validate inputs
        const validation = validateStudyGroup(groupData);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        logger.info('Creating new study group', { name: groupData.name });
        const group = await socialService.createStudyGroup(groupData);

        res.status(201).json({
            groupId: group._id,
            name: group.name,
            subject: group.subject,
            memberCount: group.members.length,
            createdBy: group.createdBy,
            createdAt: group.createdAt
        });
    } catch (error) {
        logger.error(`Study group creation error: ${error.message}`, { stack: error.stack });
        
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Study group with this name already exists' });
        }
        
        res.status(500).json({ 
            error: 'Failed to create study group',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getStudyGroups = async (req, res) => {
    try {
        const { subject, limit = 20 } = req.query;
        
        // Validate inputs
        if (limit && (isNaN(limit) || limit < 1 || limit > 50)) {
            return res.status(400).json({ error: 'Limit must be between 1-50' });
        }

        logger.info('Fetching study groups', { subject });
        const groups = await socialService.getStudyGroups({
            subject,
            limit: parseInt(limit)
        });

        res.status(200).json({
            count: groups.length,
            filters: { subject, limit },
            groups
        });
    } catch (error) {
        logger.error(`Study groups fetch error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to fetch study groups',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    createStudyGroup,
    getStudyGroups
};
