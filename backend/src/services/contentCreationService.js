const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateCourseContent = async (topic) => {
  const prompt = `Create a detailed course outline on the topic: ${topic}`;
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 500,
  });
  return response.choices[0].text;
};

module.exports = { generateCourseContent };