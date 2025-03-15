const { moderateContent } = require("../services/moderationService");

const moderate = async (req, res) => {
  const { content } = req.body;
  try {
    const moderationResult = await moderateContent(content);
    res.status(200).json({ moderationResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { moderate };