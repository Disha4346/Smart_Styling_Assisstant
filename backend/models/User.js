const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    profile: {
        gender: String,
        skinTone: String,
        stylePreferences: [String]
    },
    measurements: {
        height: Number,
        weight: Number,
        chest: Number,
        waist: Number,
        hip: Number,
        shoulderWidth: Number,
        bodyShape: String
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
