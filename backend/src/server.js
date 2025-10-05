// Final attempt to bypass stubborn deployment environment parser on line 1.
(async () => {
    // 1. ENVIRONMENT & DOTENV SETUP (Safest method for stubborn environments)
    // Using simple import for dotenv and config, relying on package.json "type": "module"
    try {
        const dotenv = await import('dotenv');
        dotenv.config();
    } catch (e) {
        console.warn("Dotenv import failed, proceeding with system environment variables.");
    }
    
    // 2. CORE MODULE IMPORTS (All must have .js extensions)
    const express = (await import('express')).default;
    const { default: apiRoutes } = await import('./routes/index.js');
    const { connectDB } = await import('./db.js'); // Updated path from ./config/db.js to ./db.js
    const { securityMiddleware } = await import('./middleware/security.js'); // Assuming existence
    
    // 3. SERVER SETUP
    const app = express();
    const PORT = process.env.PORT || 8080;
    const HOST = '0.0.0.0';

    // 4. DATABASE CONNECTION
    await connectDB();
    
    // 5. MIDDLEWARE
    app.use(express.json());
    app.use(securityMiddleware); // Applies helmet, cors, and rate limiting
    
    // 6. ROUTES
    // CRITICAL: Mount all API routes under the /api prefix, as per your requirements
    app.use('/api', apiRoutes);

    // 7. FALLBACK AND ERROR HANDLERS
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'API endpoint not found.',
            path: req.originalUrl,
            suggestion: 'Check the / endpoint for available API routes'
        });
    });

    // 8. SERVER START
    app.listen(PORT, HOST, () => {
        console.log(`🚀 Server running on ${HOST}:${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    });

})().catch(err => {
    console.error(`🔴 Fatal Server Error during initialization: ${err.message}`);
    process.exit(1);
});

