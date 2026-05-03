const express = require('express');
const router = express.Router();
const axios = require('axios');
const ClothingItem = require('../models/ClothingItem');
const Outfit = require('../models/Outfit');

// 1. Basic database search (for inspiration outfits)
router.get('/', async (req, res) => {
    try {
        const { weather, occasion, gender } = req.query;
        let query = {};
        if (weather) query['context.weather'] = weather;
        if (occasion) query['context.occasion'] = occasion;
        if (gender) query['context.gender'] = gender;

        const outfits = await Outfit.find(query).populate('items');
        res.status(200).json(outfits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Smart AI Advice (The real "Personal Stylist")
router.get('/smart', async (req, res) => {
    try {
        const { userId, weather, occasion, gender } = req.query;
        
        // Call Python AI service for fashion advice
        const aiRes = await axios.post('http://localhost:8000/recommend-outfit', {
            weather: weather || "Sunny",
            occasion: occasion || "Casual",
            gender: gender || "female"
        });

        res.status(200).json(aiRes.data);
    } catch (err) {
        console.error("Smart Rec Error:", err.message);
        res.status(500).json({ error: "Could not generate AI advice" });
    }
});

module.exports = router;
