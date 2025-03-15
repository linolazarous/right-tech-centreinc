const express = require('express');
  const router = express.Router();
  const integrationController = require('../controllers/integrationController');

  router.post('/integrate-google', integrationController.integrateGoogleWorkspace);

  module.exports = router;