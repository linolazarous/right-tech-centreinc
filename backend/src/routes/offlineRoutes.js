const express = require('express');
    const offlineController = require('../controllers/offlineController');
    const router = express.Router();

    router.get('/download-course/:courseId', offlineController.downloadCourse);

    module.exports = router;