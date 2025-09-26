import jwt from 'jsonwebtoken';
import createError from 'http-errors';

/**
 * Authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return next(createError.Unauthorized('Authorization header missing'));
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return next(createError.Unauthorized('Access token missing'));
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'],
            issuer: process.env.JWT_ISSUER || 'your-app-name'
        });
        
        req.user = {
            id: verified.sub || verified.id,
            role: verified.role,
            email: verified.email,
            sessionId: verified.jti,
            is2FAEnabled: verified.is2FAEnabled || false,
            is2FAVerified: verified.is2FAVerified || false
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(createError.Unauthorized('Token expired'));
        }
        if (error.name === 'JsonWebTokenError') {
            return next(createError.Unauthorized('Invalid token'));
        }
        next(createError.InternalServerError('Authentication failed'));
    }
};

/**
 * Authorize based on user roles
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(createError.Unauthorized('User not authenticated'));
        }
        
        if (roles.length && !roles.includes(req.user.role)) {
            return next(createError.Forbidden('Insufficient permissions'));
        }
        
        next();
    };
};

/**
 * Require 2FA verification for sensitive operations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const require2FA = (req, res, next) => {
    if (!req.user) {
        return next(createError.Unauthorized('User not authenticated'));
    }
    
    if (req.user.is2FAEnabled && !req.user.is2FAVerified) {
        return next(createError.Forbidden('2FA verification required'));
    }
    
    next();
};

/**
 * Optional authentication - sets user if token exists but doesn't require it
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const optionalAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return next(); // Continue without user data
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return next(); // Continue without user data
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'],
            issuer: process.env.JWT_ISSUER || 'your-app-name'
        });
        
        req.user = {
            id: verified.sub || verified.id,
            role: verified.role,
            email: verified.email,
            sessionId: verified.jti,
            is2FAEnabled: verified.is2FAEnabled || false,
            is2FAVerified: verified.is2FAVerified || false
        };
        
        next();
    } catch (error) {
        // For optional auth, we don't throw errors - just continue without user data
        next();
    }
};

/**
 * Check if user is the owner of the resource or has admin role
 * @param {string} resourceUserId - User ID from the resource
 * @returns {Function} Express middleware function
 */
export const isOwnerOrAdmin = (resourceUserId) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(createError.Unauthorized('User not authenticated'));
        }
        
        // Allow if user is admin or owns the resource
        if (req.user.role === 'admin' || req.user.id === resourceUserId) {
            return next();
        }
        
        return next(createError.Forbidden('Access denied: not owner or admin'));
    };
};

/**
 * Validate API key for service-to-service communication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const validateApiKey = (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    
    if (!apiKey) {
        return next(createError.Unauthorized('API key missing'));
    }
    
    if (apiKey !== process.env.API_KEY) {
        return next(createError.Unauthorized('Invalid API key'));
    }
    
    // Set service user for internal requests
    req.user = {
        id: 'system',
        role: 'service',
        isService: true
    };
    
    next();
};

/**
 * Rate limiting middleware (basic implementation)
 * @param {Object} options - Rate limiting options
 * @returns {Function} Express middleware function
 */
export const rateLimit = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        maxRequests = 100, // max requests per window
        message = 'Too many requests, please try again later.'
    } = options;
    
    const requests = new Map();
    
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Clean up old entries
        for (const [key, timestamp] of requests.entries()) {
            if (timestamp < windowStart) {
                requests.delete(key);
            }
        }
        
        const userRequests = Array.from(requests.values())
            .filter(timestamp => timestamp > windowStart)
            .length;
        
        if (userRequests >= maxRequests) {
            return next(createError.TooManyRequests(message));
        }
        
        requests.set(ip, now);
        next();
    };
};

/**
 * Combined middleware for common authentication scenarios
 */
export const auth = {
    // Basic authentication (token required)
    required: [authenticateToken],
    
    // Admin only access
    admin: [authenticateToken, authorize(['admin'])],
    
    // Authenticated user with 2FA if enabled
    secure: [authenticateToken, require2FA],
    
    // Admin with 2FA for super sensitive operations
    superAdmin: [authenticateToken, authorize(['admin']), require2FA],
    
    // Optional authentication for public/private hybrid routes
    optional: [optionalAuth],
    
    // Service-to-service communication
    service: [validateApiKey]
};

export default {
    authenticateToken,
    authorize,
    require2FA,
    optionalAuth,
    isOwnerOrAdmin,
    validateApiKey,
    rateLimit,
    auth
};
