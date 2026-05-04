const mongoose = require('mongoose');

const ClothingItemSchema = new mongoose.Schema({
    category: { 
        type: String, 
        required: true, 
        enum: ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory'] 
    },
    type: String, // e.g., Shirt, Jeans, Blazer
    metadata: {
        color: String,
        fabric: String,
        pattern: String,
        fit: String,
        brand: String,
        price: Number,
        gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' }
    },
    tags: [String], // e.g., Formal, Casual, Summer
    imageUrl: String,
    owner: { type: String }, // Changed from ObjectId to String to support custom user IDs
    isSystemItem: { type: Boolean, default: false }, // For global recommendations
    aiSuggestions: String
});

module.exports = mongoose.model('ClothingItem', ClothingItemSchema);
