const { generateAdContent } = require("../services/adService");
const { postToSocialMedia } = require("../services/socialMediaService");

const generateAndPostAd = async (req, res) => {
  const { userId } = req.body;
  try {
    const userPreferences = await getUserPreferences(userId); // Fetch user preferences from the database
    const adContent = await generateAdContent(userPreferences);

    // Post to social media
    await postToSocialMedia("linkedin", adContent);
    await postToSocialMedia("twitter", adContent);
    await postToSocialMedia("instagram", adContent);

    // Save ad to the database
    const ad = await Ad.create({ userId, content: adContent });

    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateAndPostAd };