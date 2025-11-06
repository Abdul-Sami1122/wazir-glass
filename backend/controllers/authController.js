// wazir-glass-backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Generates a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Authenticate/Login admin user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Check for user by username
  const user = await User.findOne({ username });

  // Check user and password
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
};

module.exports = { loginUser };
