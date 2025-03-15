const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const moderateContent = async (content) => {
  const prompt = `Moderate the following content: ${content}. Identify and flag any inappropriate or harmful content.`;
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 100,
  });
  return response.choices[0].text;
};

module.exports = { moderateContent };