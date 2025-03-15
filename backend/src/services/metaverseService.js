const axios = require("axios");

const createVirtualCampus = async (campusName) => {
  const response = await axios.post("https://api.metaverseplatform.com/v1/campuses", {
    name: campusName,
  }, {
    headers: {
      Authorization: `Bearer ${process.env.METAVERSE_API_KEY}`,
    },
  });
  return response.data;
};

module.exports = { createVirtualCampus };