const express = require('express');
  const router = express.Router();
  const virtualLabController = require('../controllers/virtualLabController');

  router.get('/labs', virtualLabController.getVirtualLabs);

  module.exports = router;