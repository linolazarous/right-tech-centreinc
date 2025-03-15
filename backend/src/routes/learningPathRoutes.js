const express = require('express');
const router = express.Router();
const learningPathController = require('../controllers/learningPathController');

router.get('/learning-path/:userId', learningPathController.getLearningPath);

module.exports = router;