const express = require("express");
const { generateAndPostAd } = require("../controllers/adController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate-ad", authMiddleware, generateAndPostAd);

module.exports = router;