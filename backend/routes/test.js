const express = require("express");
const { testEmailConfig, sendLoginEmail, sendRegistrationEmail } = require("../services/emailService");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/test/email-config
// @desc    Test email configuration
// @access  Public
router.get("/email-config", async (req, res) => {
  try {
    const result = await testEmailConfig();
    
    if (result.success) {
      res.json({
        success: true,
        msg: "Email configuration is valid",
        config: {
          user: process.env.GMAIL_USER,
          loginEmailEnabled: process.env.SEND_LOGIN_EMAIL === "true",
          registrationEmailEnabled: process.env.SEND_REGISTRATION_EMAIL === "true"
        }
      });
    } else {
      res.status(500).json({
        success: false,
        msg: "Email configuration error",
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error testing email configuration",
      error: error.message
    });
  }
});

// @route   POST /api/test/send-login-email
// @desc    Test login email (for authenticated user)
// @access  Private
router.post("/send-login-email", authMiddleware, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await sendLoginEmail(user.email, userAgent, ipAddress);
    
    if (result.success) {
      res.json({
        success: true,
        msg: "Test login email sent successfully",
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        msg: "Failed to send test email",
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error sending test email",
      error: error.message
    });
  }
});

// @route   POST /api/test/send-registration-email
// @desc    Test registration email (for authenticated user)
// @access  Private
router.post("/send-registration-email", authMiddleware, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found"
      });
    }

    const result = await sendRegistrationEmail(user.email);
    
    if (result.success) {
      res.json({
        success: true,
        msg: "Test registration email sent successfully",
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        msg: "Failed to send test email",
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error sending test email",
      error: error.message
    });
  }
});

module.exports = router;