const { createVREvent } = require("../services/vrCareerFairService");

const createEvent = async (req, res) => {
  const { eventName, eventDetails } = req.body;
  try {
    const event = await createVREvent(eventName, eventDetails);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createEvent };