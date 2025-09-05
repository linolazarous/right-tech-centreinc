import express from 'express';
const router = express.Router();

// ======================
// Your API Routes
// ======================

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is healthy' });
});

// Example routes
router.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Add more routes here...
router.get('/users', (req, res) => {
  res.json({ users: [] });
});

router.post('/users', (req, res) => {
  res.json({ message: 'User created' });
});

// Export the router
export default router;
