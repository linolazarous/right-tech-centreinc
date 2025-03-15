const { translateContent } = require("../services/localizationService");

const translate = async (req, res) => {
  const { text, targetLanguage } = req.body;
  try {
    const translatedText = await translateContent(text, targetLanguage);
    res.status(200).json({ translatedText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { translate };