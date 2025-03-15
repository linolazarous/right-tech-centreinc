const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateInterviewQuestions = async (jobRole) => {
  const prompt = `Generate a list of common interview questions for the role: ${jobRole}`;
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 200,
  });
  return response.choices[0].text;
};

const simulateInterview = async (jobRole, userResponses) => {
  const prompt = `Simulate an interview for the role: ${jobRole}. User responses: ${userResponses}. Provide feedback.`;
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 300,
  });
  return response.choices[0].text;
};

module.exports = { generateInterviewQuestions, simulateInterview };