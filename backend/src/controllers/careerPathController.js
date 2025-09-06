import CareerPathService from '../services/careerPathService.js';
import logger from '../utils/logger.js';
import { validateCareerPath } from '../validators/careerPathValidator.js';

class CareerPathController {
    static async getCareerPaths(req, res) {
        try {
            const { industry, experienceLevel } = req.query;
            
            // Validate query parameters if provided
            if (industry && typeof industry !== 'string') {
                return res.status(400).json({ error: 'Industry must be a string' });
            }

            if (experienceLevel && !['entry', 'mid', 'senior'].includes(experienceLevel)) {
                return res.status(400).json({ error: 'Invalid experience level' });
            }

            logger.info('Fetching career paths', { industry, experienceLevel });
            const careerPaths = await CareerPathService.getCareerPaths({ industry, experienceLevel });

            res.status(200).json({
                count: careerPaths.length,
                filters: { industry, experienceLevel },
                careerPaths
            });
        } catch (error) {
            logger.error(`Error getting career paths: ${error.message}`, { stack: error.stack });
            res.status(500).json({ 
                error: 'Failed to retrieve career paths',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    static async addCareerPath(req, res) {
        try {
            const careerPathData = req.body;
            
            // Validate input data
            const validation = validateCareerPath(careerPathData);
            if (!validation.valid) {
                return res.status(400).json({ error: validation.message });
            }

            logger.info('Adding new career path', { title: careerPathData.title });
            const newCareerPath = await CareerPathService.addCareerPath(careerPathData);

            logger.info(`Career path created: ${newCareerPath._id}`);
            res.status(201).json({
                id: newCareerPath._id,
                title: newCareerPath.title,
                createdAt: newCareerPath.createdAt
            });
        } catch (error) {
            logger.error(`Error adding career path: ${error.message}`, { stack: error.stack });
            
            if (error.name === 'MongoError' && error.code === 11000) {
                return res.status(409).json({ error: 'Career path already exists' });
            }
            
            res.status(500).json({ 
                error: 'Failed to create career path',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

export default CareerPathController;
