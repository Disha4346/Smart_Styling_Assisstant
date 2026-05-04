const mongoose = require('mongoose');

const OutfitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' }],
    context: {
        occasion: { type: String, required: true },
        weather: { type: String, required: true },
        gender: { type: String, enum: ['male', 'female', 'non-binary'], default: 'female' }
    },
    harmonyScore: { type: Number, min: 0, max: 1 },
    colorPalette: [String],
    imageUrl: String,
    styleTags: [String]
});

module.exports = mongoose.model('Outfit', OutfitSchema);
