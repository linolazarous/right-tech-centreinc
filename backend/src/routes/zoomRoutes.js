const express = require('express');
   const zoomController = require('../controllers/zoomController');
   const router = express.Router();

   router.post('/schedule-meeting', zoomController.scheduleMeeting);

   module.exports = router;