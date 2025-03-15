const express = require('express');
const router = express.Router();
const arvrController = require('../controllers/arvrController');

// Generate AR/VR content for a course
router.post('/generate', arvrController.generateARVRContent);

module.exports = router;