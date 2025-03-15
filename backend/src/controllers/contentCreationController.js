const { generateCourseContent } = require("../services/contentCreationService");

const createCourseContent = async (req, res) => {
  const { topic } = req.body;
  try {
    const content = await generateCourseContent(topic);
    res.status(201).json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createCourseContent };