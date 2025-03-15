const express = require("express");
const { createLesson, getAllLessons } = require("../controllers/microLearningController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createLesson);
router.get("/", getAllLessons);

module.exports = router;