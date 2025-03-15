const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const provideTutoring = async (userId, question) => {
  const prompt = `User ${userId} asked: ${question}. Provide a detailed explanation.`;
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 150,
  });
  return response.choices[0].text;
};

module.exports = { provideTutoring };