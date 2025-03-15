const axios = require("axios");

const createVRLesson = async (lessonName, vrContent) => {
  const response = await axios.post("https://api.vrplatform.com/v1/lessons", {
    name: lessonName,
    content: vrContent,
  }, {
    headers: {
      Authorization: `Bearer ${process.env.VR_API_KEY}`,
    },
  });
  return response.data;
};

module.exports = { createVRLesson };