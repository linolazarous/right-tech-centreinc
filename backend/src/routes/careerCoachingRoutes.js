const express = require('express');
  const router = express.Router();
  const careerCoachingController = require('../controllers/careerCoachingController');

  router.get('/advice/:userId', careerCoachingController.getCareerAdvice);

  module.exports = router;