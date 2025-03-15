const express = require("express");
const { createCampus } = require("../controllers/metaverseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createCampus);

module.exports = router;