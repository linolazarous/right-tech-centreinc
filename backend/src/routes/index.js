// =================================================================
//                    Main API Router - Right Tech Centre
// =================================================================
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Directory reference for dynamic import
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically import all route files
const routesPath = __dirname;

fs.readdirSync(routesPath).forEach(async (file) => {
  if (file.endsWith('Routes.js') && file !== 'index.js') {
    const modulePath = path.join(routesPath, file);
    const routeModule = await import(modulePath);

    // Auto-generate base path from filename
    const base = file
      .replace('Routes.js', '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();

    // Example: userRoutes.js → /api/user
    const mountPath = `/api/${base}`;
    router.use(mountPath, routeModule.default);
  }
});

// Health Check Route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Right Tech Centre API is operational',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    provider: 'DigitalOcean App Platform',
  });
});

// 404 Handler
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.',
    path: req.originalUrl,
  });
});

export default router;
