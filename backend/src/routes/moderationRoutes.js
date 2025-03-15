const express = require("express");
const { moderate } = require("../controllers/moderationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/moderate", authMiddleware, moderate);

module.exports = router;