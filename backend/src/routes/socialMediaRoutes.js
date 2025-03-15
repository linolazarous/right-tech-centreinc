const express = require("express");
const { postToSocialMedia } = require("./path/to/your/module"); // Adjust the path to your module
const router = express.Router();

// Route to post content to a social media platform
router.post("/post/:platform", async (req, res) => {
  const { platform } = req.params; // Get the platform from the URL parameter
  const { content } = req.body; // Get the content from the request body

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const result = await postToSocialMedia(platform, content);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error posting to social media:", error.message);
    res.status(500).json({ error: "Failed to post to social media" });
  }
});

module.exports = router;