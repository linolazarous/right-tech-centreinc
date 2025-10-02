import express from 'express';
// FIX: Using require() for dotenv setup to avoid Line 1 SyntaxError issues in older environments.
import * as dotenv from 'dotenv'; 
dotenv.config();

// Load Modules with .js Extension (Crucial for ES Module Resolution)
import { connectDB } from './config/db.js';
import { setupSecurityMiddleware } from './middleware/security.js';
import globalErrorHandler from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';
import { logger } from './utils/logger.js';

// --- Initialization ---

// Connect to Database
connectDB();

const app = express();

// --- Middleware ---
setupSecurityMiddleware(app);

app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.get('/', (req, res) => {
    // This is the successful base path you tested earlier
    res.status(200).json({ 
        success: true, 
        message: 'Right Tech Centre API Server',
        version: process.env.npm_package_version,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        availableEndpoints: [
            '/api/auth/*',
            '/api/users/*',
            '/api/courses/*',
            '/api/payment/*',
            '/api/admin/*',
            '/api/analytics/*'
        ]
    });
});

app.use('/api', apiRoutes); // Mount all API routes

// --- Error Handlers ---
app.use(globalErrorHandler);

// Fallback 404 Handler (This will be caught by the general error handler in production)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found.',
        path: req.originalUrl,
        suggestion: 'Check the / endpoint for available API routes'
    });
});


// --- Server Start ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export { app }; // Export for testing
