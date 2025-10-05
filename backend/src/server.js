// Server startup with safe, compatible syntax
import express from 'express';
import dotenv from 'dotenv';

// Initialize environment and express first
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Safe async startup function
async function startServer() {
    try {
        // 1. DATABASE CONNECTION
        const { connectDB } = await import('./db.js');
        await connectDB();
        
        // 2. MIDDLEWARE IMPORTS
        const { securityMiddleware } = await import('./middleware/security.js');
        
        // 3. ROUTES IMPORT
        const { default: apiRoutes } = await import('./routes/index.js');
        
        // 4. APPLY MIDDLEWARE
        app.use(express.json());
        app.use(securityMiddleware);
        
        // 5. MOUNT ROUTES
        app.use('/api', apiRoutes);

        // 6. FALLBACK ROUTE
        app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'API endpoint not found.',
                path: req.originalUrl,
                suggestion: 'Check the /api endpoint for available routes'
            });
        });

        // 7. START SERVER
        app.listen(PORT, HOST, () => {
            console.log(`🚀 Server running on ${HOST}:${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

    } catch (err) {
        console.error(`🔴 Fatal Server Error: ${err.message}`);
        process.exit(1);
    }
}

// Start the server
startServer();
