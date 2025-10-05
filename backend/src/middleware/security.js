// =================================================================
//                   Security & Performance Middleware
// =================================================================
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { logger } from '../utils/logger.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://righttechcentre.vercel.app';
const API_RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const API_RATE_LIMIT_MAX = 100;

const corsOptions = {
  origin: [
    FRONTEND_URL,
    /\.righttechcentre\.vercel\.app$/,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

const publicApiLimiter = rateLimit({
  windowMs: API_RATE_LIMIT_WINDOW,
  max: API_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, try again later.' },
});

const compressionMiddleware = compression();

export const setupSecurityMiddleware = (app) => {
  logger.info('Applying security middleware...');
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(compressionMiddleware);
  app.use(publicApiLimiter);
  logger.info('✅ Security middleware applied successfully.');
};

export { corsOptions, publicApiLimiter };
