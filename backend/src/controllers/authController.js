const { generate2FASecret, verify2FAToken } = require("../services/authService");

const enable2FA = async (req, res) => {
  const { userId } = req.body;
  try {
    const secret = generate2FASecret();
    // Save the secret in the user's profile
    res.status(200).json({ secret: secret.base32 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verify2FA = async (req, res) => {
  const { userId, token } = req.body;
  try {
    const user = await User.findById(userId);
    const isValid = verify2FAToken(user.twoFASecret, token);
    if (isValid) {
      res.status(200).json({ message: "2FA verified successfully" });
    } else {
      res.status(401).json({ error: "Invalid 2FA token" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { enable2FA, verify2FA };
