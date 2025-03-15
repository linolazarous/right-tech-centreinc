const express = require('express');
const router = express.Router();
const AffiliationController = require('../controllers/affiliationController');

// Get all affiliations
router.get('/affiliations', AffiliationController.getAffiliations);

// Add a new affiliation
router.post('/affiliations', AffiliationController.addAffiliation);

module.exports = router;