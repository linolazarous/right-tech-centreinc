const { createARLesson } = require("../services/arLearningService");

const createLesson = async (req, res) => {
  const { lessonName, arContent } = req.body;
  try {
    const lesson = await createARLesson(lessonName, arContent);
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createLesson };