const express = require('express');
const router = express.Router();
const proctoringController = require('../controllers/proctoringController');

router.post('/monitor-exam', proctoringController.monitorExam);

module.exports = router;