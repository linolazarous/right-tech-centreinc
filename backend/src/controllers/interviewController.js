const { generateInterviewQuestions, simulateInterview } = require("../services/interviewService");

const getInterviewQuestions = async (req, res) => {
  const { jobRole } = req.body;
  try {
    const questions = await generateInterviewQuestions(jobRole);
    res.status(200).json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const conductMockInterview = async (req, res) => {
  const { jobRole, userResponses } = req.body;
  try {
    const feedback = await simulateInterview(jobRole, userResponses);
    res.status(200).json({ feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getInterviewQuestions, conductMockInterview };