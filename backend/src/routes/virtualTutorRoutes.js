const express = require("express");
const { askTutor } = require("../controllers/virtualTutorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/ask", authMiddleware, askTutor);

module.exports = router;