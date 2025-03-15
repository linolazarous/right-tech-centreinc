const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');

router.post('/issue-certificate', blockchainController.issueCertificate);

module.exports = router;