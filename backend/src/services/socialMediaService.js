const axios = require("axios");

const postToSocialMedia = async (platform, content) => {
  const url = `https://api.${platform}.com/v1/posts`;
  const response = await axios.post(url, { content }, {
    headers: {
      Authorization: `Bearer ${process.env[`${platform.toUpperCase()}_API_KEY`]}`,
    },
  });
  return response.data;
};

module.exports = { postToSocialMedia };