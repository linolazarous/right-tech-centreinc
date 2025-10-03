// Use ES Module syntax for exports and imports
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'; // Using the alias for rate-limiter-flexible 
import compression from 'compression';
import { logger } from '../utils/logger.js';

// --- Configuration ---

// Get frontend URL from environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://righttechcentre.vercel.app';
const API_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const API_RATE_LIMIT_MAX = 100; // Max 100 requests per 15 minutes

// --- Middleware Definitions ---

// 1. CORS Configuration
const corsOptions = {
  // CRITICAL: Must include your production domains.
  // Using the FRONTEND_URL variable for dynamic deployment environments
  origin: [
    FRONTEND_URL, 
    'https://righttechcentre.vercel.app', 
    /\.righttechcentre\.vercel\.app$/, // Allow Vercel preview URLs
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// 2. Rate Limiter
// Prevents Brute-force/DDoS attacks by limiting public requests
const publicApiLimiter = rateLimit({
  windowMs: API_RATE_LIMIT_WINDOW,
  max: API_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: JSON.stringify({
    success: false,
    message: 'Too many requests, please try again after 15 minutes.',
  }),
});

// 3. Compression (improves response speed)
const compressionMiddleware = compression();

// --- Main Setup Function ---

/**
 * Sets up core security and performance middleware.
 * @param {import('express').Application} app - The Express application instance.
 */
export const setupSecurityMiddleware = (app) => {
  logger.info('Applying security and performance middleware...');

  // 1. CORS: Must be applied first to allow client requests
  app.use(cors(corsOptions));

  // 2. Helmet: Secure Express apps by setting various HTTP headers
  app.use(helmet());

  // 3. Compression: Enable GZIP compression for faster payloads
  app.use(compressionMiddleware);

  // 4. Rate Limiting: Apply rate limits to all API routes
  // You might want to apply this only to /api/* routes later
  app.use(publicApiLimiter); 

  logger.info('Security middleware applied successfully.');
};

// You can also export the middlewares individually if needed
export { corsOptions, publicApiLimiter };
