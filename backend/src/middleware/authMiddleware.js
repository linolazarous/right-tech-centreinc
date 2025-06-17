const jwt = require('jsonwebtoken');
const createError = require('http-errors');

exports.authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return next(createError.Unauthorized('Authorization header missing'));

    const token = authHeader.replace('Bearer ', '');
    if (!token) return next(createError.Unauthorized('Access token missing'));

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'],
            issuer: process.env.JWT_ISSUER || 'your-app-name'
        });
        
        req.user = {
            id: verified.sub || verified.id,
            role: verified.role,
            sessionId: verified.jti
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

exports.authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) return next(createError.Unauthorized('User not authenticated'));
        if (roles.length && !roles.includes(req.user.role)) {
            return next(createError.Forbidden('Insufficient permissions'));
        }
        next();
    };
};
