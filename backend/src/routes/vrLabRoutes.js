const express = require('express');
  const router = express.Router();
  const vrLabController = require('../controllers/vrLabController');

  router.get('/labs', vrLabController.getVRLabs);

  module.exports = router;