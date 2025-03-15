const User = require("../models/User");

const getPrivacyPolicy = async (req, res) => {
  res.status(200).json({ policy: "Your privacy policy here" });
};

const deleteUserData = async (req, res) => {
  const { userId } = req.body;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User data deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPrivacyPolicy, deleteUserData };