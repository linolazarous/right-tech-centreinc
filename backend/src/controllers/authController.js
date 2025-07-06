const { generate2FASecret, verify2FAToken } = require("../services/authService");
const User = require('../models/User');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../utils/helpers');

const enable2FA = async (req, res) => {
    const { userId } = req.body;
    
    try {
        // Validate user ID
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.twoFAEnabled) {
            return res.status(400).json({ error: '2FA is already enabled for this user' });
        }

        const secret = generate2FASecret(user.email);
        
        // Return the secret but don't save it yet - user needs to verify first
        logger.info(`2FA setup initiated for user: ${userId}`);
        res.status(200).json({ 
            secret: secret.base32,
            otpauthUrl: secret.otpauth_url,
            message: 'Scan QR code with authenticator app and verify'
        });
    } catch (err) {
        logger.error(`Error enabling 2FA: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to enable 2FA',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

const verify2FA = async (req, res) => {
    const { userId, token, secret } = req.body;
    
    try {
        // Validate inputs
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        if (!token || typeof token !== 'string' || token.length !== 6) {
            return res.status(400).json({ error: 'Invalid token format' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isValid = verify2FAToken(secret || user.twoFASecret, token);
        
        if (isValid) {
            if (!user.twoFAEnabled) {
                // First-time verification - enable 2FA
                user.twoFASecret = secret;
                user.twoFAEnabled = true;
                await user.save();
                logger.info(`2FA successfully enabled for user: ${userId}`);
            } else {
                logger.info(`2FA successfully verified for user: ${userId}`);
            }
            
            return res.status(200).json({ 
                message: "2FA verified successfully",
                twoFAEnabled: user.twoFAEnabled
            });
        }
        
        logger.warn(`Invalid 2FA token provided for user: ${userId}`);
        res.status(401).json({ error: "Invalid 2FA token" });
    } catch (err) {
        logger.error(`Error verifying 2FA: ${err.message}`, { stack: err.stack });
        res.status(500).json({ 
            error: 'Failed to verify 2FA',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = { 
    enable2FA, 
    verify2FA 
};
