import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import db from './db.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 8080;

// ==============================================
// Basic Middleware
// ==============================================
app.use(cors());
app.use(express.json());

// ==============================================
// Health Check Endpoint (REQUIRED for DigitalOcean)
// ==============================================
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    dbStatus,
    uptime: process.uptime()
  });
});

// ==============================================
// Basic Routes
// ==============================================
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// Use your routes
app.use('/api/auth', routes.authRoutes);
app.use('/api/users', routes.userRoutes);

// ==============================================
// Database Connection
// ==============================================
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGO_URI || db.mongoURI, mongoOptions)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
  });

// ==============================================
// Start Server (CRITICAL FIX FOR DIGITALOCEAN)
// ==============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://0.0.0.0:${PORT}/health`);
});

// Export for testing
export default app;
