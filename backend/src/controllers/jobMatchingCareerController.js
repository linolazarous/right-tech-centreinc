const { matchJobs } = require("../services/jobMatchingService");
const { generateResume } = require("../services/resumeService");
const { generateInterviewQuestions, simulateInterview } = require("../services/interviewService");

const getJobMatches = async (req, res) => {
  const { userId } = req.body;
  try {
    const userSkills = await getUserSkills(userId); // Fetch user skills from the database
    const userPreferences = await getUserPreferences(userId); // Fetch user preferences from the database
    const jobs = await matchJobs(userSkills, userPreferences);
    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createResume = async (req, res) => {
  const { userId } = req.body;
  try {
    const userSkills = await getUserSkills(userId);
    const userExperience = await getUserExperience(userId);
    const resume = await generateResume(userSkills, userExperience);
    res.status(201).json({ resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

module.exports = { getJobMatches, createResume, getInterviewQuestions, conductMockInterview };