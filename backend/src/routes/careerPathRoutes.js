const express = require('express');
  const router = express.Router();
  const careerPathController = require('../controllers/careerPathController');

  router.get('/recommend/:userId', careerPathController.recommendCareerPath);

  module.exports = router;