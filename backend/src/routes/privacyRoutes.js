const express = require("express");
const { getPrivacyPolicy, deleteUserData } = require("../controllers/privacyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/privacy-policy", getPrivacyPolicy);
router.delete("/delete-data", authMiddleware, deleteUserData);

module.exports = router;