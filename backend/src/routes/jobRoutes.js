const express = require('express');
const jobController = require('../controllers/jobController');
const router = express.Router();

router.get('/jobs/recommendations', jobController.getJobRecommendations);

module.exports = router;