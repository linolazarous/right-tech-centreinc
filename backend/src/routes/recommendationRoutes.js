const express = require('express');
   const recommendationController = require('../controllers/recommendationController');
   const router = express.Router();

   router.get('/recommendations', recommendationController.getRecommendations);

   module.exports = router;