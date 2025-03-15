const express = require("express");
const { createLesson } = require("../controllers/arLearningController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createLesson);

module.exports = router;