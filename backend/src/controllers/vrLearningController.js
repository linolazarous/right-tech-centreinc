const { createVRLesson } = require("../services/vrLearningService");

const createLesson = async (req, res) => {
  const { lessonName, vrContent } = req.body;
  try {
    const lesson = await createVRLesson(lessonName, vrContent);
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createLesson };