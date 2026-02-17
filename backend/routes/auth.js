const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const { registerValidation, loginValidation, profileValidation } = require("../middleware/validate");

const router = express.Router();

// Rate limiter for auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    msg: "Too many authentication attempts. Please try again in 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", authLimiter, registerValidation, authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", authLimiter, loginValidation, authController.login);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", authMiddleware, authController.getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", authMiddleware, profileValidation, authController.updateProfile);

module.exports = router;