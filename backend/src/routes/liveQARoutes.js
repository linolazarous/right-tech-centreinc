const express = require('express');
  const router = express.Router();
  const liveQAController = require('../controllers/liveQAController');

  router.post('/schedule', liveQAController.scheduleLiveQA);

  module.exports = router;