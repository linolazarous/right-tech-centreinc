const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateAdContent = async (userPreferences) => {
  const prompt = `Generate a personalized ad based on the following user preferences: ${userPreferences}`;
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 100,
  });
  return response.choices[0].text;
};

module.exports = { generateAdContent };