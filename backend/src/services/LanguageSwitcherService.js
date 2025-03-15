const AWS = require("aws-sdk");
const translate = new AWS.Translate();

const translateText = async (text, targetLanguage) => {
  const params = {
    Text: text,
    SourceLanguageCode: "auto",
    TargetLanguageCode: targetLanguage,
  };
  const result = await translate.translateText(params).promise();
  return result.TranslatedText;
};

module.exports = { translateText };