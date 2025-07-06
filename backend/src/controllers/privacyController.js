const User = require("../models/User");
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

const getPrivacyPolicy = async (req, res) => {
    try {
        const policyVersion = '1.0.2';
        const effectiveDate = '2023-01-01';
        
        logger.info('Privacy policy requested');
        res.status(200).json({ 
            version: policyVersion,
            effectiveDate,
            policy: "Your comprehensive privacy policy content here...",
            summary: "This policy outlines how we collect, use, and protect your data."
        });
    } catch (err) {
        logger.error(`Privacy policy error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to retrieve privacy policy',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

const deleteUserData = async (req, res) => {
    const { userId, confirmation = false } = req.body;
    
    try {
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (confirmation !== true) {
            return res.status(400).json({ 
                error: 'Confirmation required',
                message: 'Set confirmation=true to proceed with data deletion'
            });
        }

        logger.info(`Initiating data deletion for user: ${userId}`);
        const result = await User.findByIdAndDelete(userId);
        
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        logger.info(`User data deleted: ${userId}`);
        res.status(200).json({ 
            message: "User data deleted successfully",
            userId,
            deletedAt: new Date().toISOString()
        });
    } catch (err) {
        logger.error(`Data deletion error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to delete user data',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = { 
    getPrivacyPolicy, 
    deleteUserData 
};
