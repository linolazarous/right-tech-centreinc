const express = require("express");
const { subscribe, getUserSubscriptions } = require("../controllers/subscriptionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, subscribe);
router.get("/:userId", authMiddleware, getUserSubscriptions);

module.exports = router;