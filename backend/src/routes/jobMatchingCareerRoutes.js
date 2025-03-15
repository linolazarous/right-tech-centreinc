const express = require("express");
const { getJobMatches, createResume, getInterviewQuestions, conductMockInterview } = require("../controllers/careerController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/job-matches", authMiddleware, getJobMatches);
router.post("/create-resume", authMiddleware, createResume);
router.post("/interview-questions", authMiddleware, getInterviewQuestions);
router.post("/mock-interview", authMiddleware, conductMockInterview);

module.exports = router;