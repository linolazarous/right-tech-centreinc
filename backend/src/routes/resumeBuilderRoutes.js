const express = require('express');
  const router = express.Router();
  const resumeBuilderController = require('../controllers/resumeBuilderController');

  router.get('/generate/:userId', resumeBuilderController.generateResume);

  module.exports = router;