const express = require("express");
const { createLesson } = require("../controllers/vrLearningController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createLesson);

module.exports = router;