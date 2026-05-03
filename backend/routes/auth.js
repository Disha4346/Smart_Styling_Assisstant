const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/email');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            isVerified: false
        });

        await user.save();

        // Send Verification Email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (emailErr) {
            console.error('Failed to send email, but user was created:', emailErr);
            // We can decide to delete the user or just proceed
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ 
            message: 'User registered successfully. Please check your email to verify your account.', 
            token,
            user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified }
        });

    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Optional: Block login if not verified
        // if (!user.isVerified) {
        //     return res.status(403).json({ error: 'Please verify your email before logging in.' });
        // }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified }
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Email Verification Route
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).send('<h2>Invalid or expired verification token.</h2>');
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).send(`
            <div style="text-align: center; font-family: sans-serif; padding: 50px;">
                <h1 style="color: #d8b4e2;">Email Verified Successfully! ✨</h1>
                <p>You can now return to the app and explore your personalized wardrobe.</p>
                <a href="http://localhost:5173/login" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #e6c1c1; color: white; text-decoration: none; border-radius: 8px;">Go to Login</a>
            </div>
        `);
    } catch (err) {
        console.error('Verification Error:', err.message);
        res.status(500).send('<h2>Server error during verification.</h2>');
    }
});

module.exports = router;
