
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://righttechcentre-iyysq.ondigitalocean.app' 
    : 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Backend API is working!', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
