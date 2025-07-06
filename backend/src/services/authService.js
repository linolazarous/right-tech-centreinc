const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

class AuthService {
  static async register(userData) {
    const { email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ ...userData, password: hashedPassword });
    await newUser.save();
    return newUser;
  }

  static async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user };
  }
}

module.exports = AuthService;
