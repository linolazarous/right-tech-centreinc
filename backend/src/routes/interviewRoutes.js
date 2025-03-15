const express = require("express");
const { getInterviewQuestions, conductMockInterview } = require("../controllers/interviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/questions", authMiddleware, getInterviewQuestions);
router.post("/mock-interview", authMiddleware, conductMockInterview);

module.exports = router;