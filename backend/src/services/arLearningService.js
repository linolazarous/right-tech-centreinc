const axios = require("axios");

const createARLesson = async (lessonName, arContent) => {
  const response = await axios.post("https://api.arplatform.com/v1/lessons", {
    name: lessonName,
    content: arContent,
  }, {
    headers: {
      Authorization: `Bearer ${process.env.AR_API_KEY}`,
    },
  });
  return response.data;
};

module.exports = { createARLesson };