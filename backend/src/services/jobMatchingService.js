const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const matchJobs = async (userSkills, userPreferences) => {
  const prompt = `Match jobs based on the following skills and preferences: Skills: ${userSkills}, Preferences: ${userPreferences}`;
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 100,
  });
  return response.choices[0].text;
};

module.exports = { matchJobs };