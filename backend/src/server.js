// =================================================================
//                      Server Startup (Production Ready)
// =================================================================
import express from 'express';
import dotenv from 'dotenv';
import { setupSecurityMiddleware } from './middleware/security.js';

// Initialize environment
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

async function startServer() {
  try {
    // 1. DATABASE CONNECTION
    const { connectDB } = await import('./db.js');
    await connectDB();

    // 2. CORE MIDDLEWARE
    app.use(express.json());
    setupSecurityMiddleware(app);

    // 3. ROUTES
    const { default: apiRoutes } = await import('./routes/index.js');
    app.use('/', apiRoutes);

    // 4. FALLBACK HANDLER
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'API endpoint not found.',
        path: req.originalUrl,
      });
    });

    // 5. START SERVER
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on ${HOST}:${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error(`🔴 Fatal Server Error: ${err.message}`);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  console.error('🛑 Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

startServer();
