const MicroLesson = require("../models/MicroLesson");

const createMicroLesson = async ({ title, content, duration }) => {
  const microLesson = await MicroLesson.create({ title, content, duration });
  return microLesson;
};

const getMicroLessons = async () => {
  const microLessons = await MicroLesson.findAll();
  return microLessons;
};

module.exports = { createMicroLesson, getMicroLessons };