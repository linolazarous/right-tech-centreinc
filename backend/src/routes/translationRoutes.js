const express = require('express');
    const translationController = require('../controllers/translationController');
    const router = express.Router();

    router.post('/translate', translationController.translateText);

    module.exports = router;