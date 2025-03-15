const express = require("express");
const { translate } = require("../controllers/languageSwitcherController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/translate", authMiddleware, translate);

module.exports = router;