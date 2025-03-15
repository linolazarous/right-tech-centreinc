const express = require("express");
const { createEvent } = require("../controllers/vrCareerFairController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-event", authMiddleware, createEvent);

module.exports = router;