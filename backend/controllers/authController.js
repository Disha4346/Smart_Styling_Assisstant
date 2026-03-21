// controllers/authController.js
const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "30d" });

const userPayload = (u) => ({
  id: u._id, name: u.name, email: u.email,
  height: u.height, weight: u.weight, bodyShape: u.bodyShape,
  skinTone: u.skinTone, stylePreference: u.stylePreference,
  createdAt: u.createdAt,
});

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Name, email and password are required" });

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "Email already registered" });

    const user  = await User.create({ name, email, password });
    const token = genToken(user._id);
    res.status(201).json({ success: true, message: "Registered successfully", token, user: userPayload(user) });
  } catch (e) {
    console.error("Register error:", e.message);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = genToken(user._id);
    res.json({ success: true, message: "Login successful", token, user: userPayload(user) });
  } catch (e) {
    console.error("Login error:", e.message);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user: userPayload(user) });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/auth/profile  — update measurements + style prefs
const updateProfile = async (req, res) => {
  try {
    const allowed = ["name","height","weight","chest","waist","hip","shoulderWidth","bodyShape","skinTone","gender","stylePreference"];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.json({ success: true, user: userPayload(user) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { register, login, getMe, updateProfile };