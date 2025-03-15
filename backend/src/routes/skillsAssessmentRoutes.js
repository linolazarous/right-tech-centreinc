const express = require('express');
  const router = express.Router();
  const skillAssessmentController = require('../controllers/skillAssessmentController');

  router.post('/assess', skillAssessmentController.assessSkill);

  module.exports = router;