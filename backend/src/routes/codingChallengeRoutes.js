const express = require('express');
  const router = express.Router();
  const codingChallengeController = require('../controllers/codingChallengeController');

  router.get('/challenges', codingChallengeController.getCodingChallenges);

  module.exports = router;