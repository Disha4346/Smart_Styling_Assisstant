const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendLoginEmail, sendRegistrationEmail } = require("../services/emailService");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User with this email already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Send welcome email (non-blocking)
    sendRegistrationEmail(email).catch(err => 
      console.error("Email send failed (non-critical):", err.message)
    );

    res.status(201).json({
      success: true,
      msg: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error during registration",
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials"
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Get request info for email
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Send login notification email (non-blocking)
    sendLoginEmail(email, userAgent, ipAddress).catch(err => 
      console.error("Email send failed (non-critical):", err.message)
    );

    res.json({
      success: true,
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error during login",
      error: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error fetching profile",
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { profile, preferences } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    // Update profile fields
    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    // Update preferences
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error updating profile",
      error: error.message
    });
  }
};