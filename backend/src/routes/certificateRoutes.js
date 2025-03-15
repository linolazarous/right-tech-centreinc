const express = require('express');
   const certificateController = require('../controllers/certificateController');
   const router = express.Router();

   router.post('/issue-certificate', certificateController.issueCertificate);

   module.exports = router;