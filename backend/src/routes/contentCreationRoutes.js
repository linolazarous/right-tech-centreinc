const express = require("express");
const { createCourseContent } = require("../controllers/contentCreationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createCourseContent);

module.exports = router;