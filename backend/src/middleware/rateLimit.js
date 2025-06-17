const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const { createClient } = require('redis');

let store;
if (process.env.REDIS_URL) {
    const redisClient = createClient({
        url: process.env.REDIS_URL,
        socket: {
            tls: true,
            rejectUnauthorized: false
        }
    });
    redisClient.connect().catch(console.error);

    store = new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: 'rl:'
    });
}

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    store
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: process.env.AUTH_RATE_LIMIT_MAX || 10,
    message: 'Too many login attempts, please try again later',
    skip: req => req.ip === '::1' // Skip for localhost in development
});

module.exports = { apiLimiter, authLimiter };
