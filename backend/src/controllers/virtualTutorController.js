const { provideTutoring } = require("../services/virtualTutorService");

const askTutor = async (req, res) => {
  const { userId, question } = req.body;
  try {
    const answer = await provideTutoring(userId, question);
    res.status(200).json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { askTutor };