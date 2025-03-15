const express = require('express');
const scholarshipController = require('../controllers/scholarshipController');
const router = express.Router();

router.post('/scholarships/allocate', scholarshipController.allocateScholarship);

module.exports = router;