const axios = require("axios");

const createVREvent = async (eventName, eventDetails) => {
  const response = await axios.post("https://api.vrplatform.com/v1/events", {
    name: eventName,
    details: eventDetails,
  }, {
    headers: {
      Authorization: `Bearer ${process.env.VR_API_KEY}`,
    },
  });
  return response.data;
};

module.exports = { createVREvent };