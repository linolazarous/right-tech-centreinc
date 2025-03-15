const AWS = require('aws-sdk');
   const translate = new AWS.Translate();

   exports.translateText = async (text, targetLanguage) => {
       const params = {
           Text: text,
           SourceLanguageCode: 'en',
           TargetLanguageCode: targetLanguage,
       };
       const result = await translate.translateText(params).promise();
       return result.TranslatedText;
   };