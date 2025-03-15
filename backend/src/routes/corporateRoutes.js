const express = require('express');
const router = express.Router();
const corporateTrainingController = require('../controllers/corporateTrainingController');

router.post('/corporate-training', corporateTrainingController.createTraining);

module.exports = router;