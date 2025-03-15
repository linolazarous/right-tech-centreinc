const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');

router.post('/study-groups', socialController.createStudyGroup);
router.get('/study-groups', socialController.getStudyGroups);

module.exports = router;