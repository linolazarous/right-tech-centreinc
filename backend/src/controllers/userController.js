// backend/src/controllers/userController.js
import UserService from '../services/userService.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';
import { validateUserProfile } from '../validators/userValidator.js';

// ✅ Named exports to match route imports
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        logger.info(`Fetching profile for user: ${userId}`);
        const user = await UserService.getUserProfile(userId);

        if (!user) {
            logger.warn(`User not found: ${userId}`);
            return res.status(404).json({ error: 'User not found' });
        }

        const { password, twoFASecret, ...userData } = user.toObject();
        res.status(200).json(userData);
    } catch (error) {
        logger.error(`User profile fetch error: ${error.message}`, { stack: error.stack });
        res.status(500).json({ 
            error: 'Failed to fetch user profile',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedData = req.body;
        
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const validation = validateUserProfile(updatedData);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        logger.info(`Updating profile for user: ${userId}`);
        const result = await UserService.updateUserProfile(userId, updatedData);

        if (!result.success) {
            logger.warn(`Profile update failed for user: ${userId}`);
            return res.status(400).json(result);
        }

        res.status(200).json({
            userId,
            updatedFields: Object.keys(updatedData),
            updatedAt: result.updatedAt
        });
    } catch (error) {
        logger.error(`User profile update error: ${error.message}`, { stack: error.stack });
        
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Email or username already exists' });
        }
        
        res.status(500).json({ 
            error: 'Failed to update user profile',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
