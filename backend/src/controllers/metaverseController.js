const { createVirtualCampus } = require("../services/metaverseService");

const createCampus = async (req, res) => {
  const { campusName } = req.body;
  try {
    const campus = await createVirtualCampus(campusName);
    res.status(201).json(campus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createCampus };