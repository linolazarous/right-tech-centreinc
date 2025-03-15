const express = require('express');
  const router = express.Router();
  const gamificationController = require('../controllers/gamificationController');

  router.post('/award-badge', gamificationController.awardBadge);

  module.exports = router;