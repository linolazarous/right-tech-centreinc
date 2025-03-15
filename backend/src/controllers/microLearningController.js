const { createMicroLesson, getMicroLessons } = require("../services/microLearningService");

const createLesson = async (req, res) => {
  const { title, content, duration } = req.body;
  try {
    const microLesson = await createMicroLesson({ title, content, duration });
    res.status(201).json(microLesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllLessons = async (req, res) => {
  try {
    const microLessons = await getMicroLessons();
    res.status(200).json(microLessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createLesson, getAllLessons };