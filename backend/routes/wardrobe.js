const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ClothingItem = require('../models/ClothingItem');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const axios = require('axios');

// Add item to wardrobe with image
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { userId } = req.body;
        let { category, type, color, brand, aiSuggestions } = req.body;
        
        let imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.imageUrl;

        // If an image was uploaded and no AI suggestions provided, call AI service
        if (req.file && !aiSuggestions) {
            try {
                const fs = require('fs');
                const fileStream = fs.createReadStream(req.file.path);
                
                // We need to use form-data package for node.js to send files via axios
                const FormDataNode = require('form-data');
                const form = new FormDataNode();
                form.append('file', fileStream);

                const aiRes = await axios.post('http://localhost:8000/analyze-clothing', form, {
                    headers: form.getHeaders()
                });

                console.log("AI Service Response:", aiRes.data);

                if (aiRes.data) {
                    category = aiRes.data.category || category;
                    type = aiRes.data.type || type;
                    color = aiRes.data.color || color;
                    aiSuggestions = aiRes.data.suggestions || aiSuggestions;
                }
            } catch (aiErr) {
                console.error('AI Service Error:', aiErr.message);
                // Fallback to provided data or defaults
            }
        }

        const newItem = new ClothingItem({
            category: category || 'Top',
            type: type || 'Unknown',
            metadata: {
                color: color || 'Unknown',
                brand: brand || 'Unbranded'
            },
            imageUrl,
            owner: userId,
            isSystemItem: false,
            aiSuggestions
        });
        console.log("Final Item to Save:", newItem);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error("Database/Server Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get user wardrobe
router.get('/:userId', async (req, res) => {
    try {
        const items = await ClothingItem.find({ owner: req.params.userId });
        res.status(200).json(items);
    } catch (err) {
        console.error("Database/Server Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete from wardrobe
router.delete('/:itemId', async (req, res) => {
    try {
        await ClothingItem.findByIdAndDelete(req.params.itemId);
        res.status(200).json({ message: 'Item removed from wardrobe' });
    } catch (err) {
        console.error("Database/Server Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
