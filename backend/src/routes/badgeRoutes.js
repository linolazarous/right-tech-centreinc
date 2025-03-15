const express = require('express');
const router = express.Router();
const BadgeController = require('../controllers/badgeController');

// Get all badges
router.get('/badges', BadgeController.getAllBadges);

// Assign a badge to a user
router.post('/badges/assign', BadgeController.assignBadgeToUser);

module.exports = router;