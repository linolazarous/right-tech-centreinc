import CareerPathService from '../services/careerPathService.js';
import logger from '../utils/logger.js';
import { validateCareerPath } from '../validators/careerPathValidator.js';

class CareerPathController {
    static async getCareerPaths(req, res) {
        try {
            const { industry, experienceLevel } = req.query;

            if (industry && typeof industry !== 'string') {
                return res.status(400).json({ success: false, error: 'Industry must be a string' });
            }

            if (experienceLevel && !['entry', 'mid', 'senior'].includes(experienceLevel)) {
                return res.status(400).json({ success: false, error: 'Invalid experience level' });
            }

            logger.info('🧭 Fetching career paths', { industry, experienceLevel });
            const careerPaths = await CareerPathService.getCareerPaths({ industry, experienceLevel });

            return res.status(200).json({
                success: true,
                count: careerPaths.length,
                filters: { industry, experienceLevel },
                careerPaths
            });
        } catch (error) {
            logger.error(`❌ Error fetching career paths: ${error.message}`, { stack: error.stack });
            return res.status(500).json({
                success: false,
                error: 'Failed to retrieve career paths',
                ...(process.env.NODE_ENV === 'development' && { details: error.message })
            });
        }
    }

    static async addCareerPath(req, res) {
        try {
            const careerPathData = req.body;
            const validation = validateCareerPath(careerPathData);

            if (!validation.valid) {
                return res.status(400).json({ success: false, error: validation.message });
            }

            logger.info('🆕 Adding new career path', { title: careerPathData.title });
            const newCareerPath = await CareerPathService.addCareerPath(careerPathData);

            return res.status(201).json({
                success: true,
                message: 'Career path successfully created',
                data: {
                    id: newCareerPath._id,
                    title: newCareerPath.title,
                    createdAt: newCareerPath.createdAt
                }
            });
        } catch (error) {
            logger.error(`❌ Error adding career path: ${error.message}`, { stack: error.stack });

            if (error.code === 11000) {
                return res.status(409).json({ success: false, error: 'Career path already exists' });
            }

            return res.status(500).json({
                success: false,
                error: 'Failed to create career path',
                ...(process.env.NODE_ENV === 'development' && { details: error.message })
            });
        }
    }
}

export default CareerPathController;
