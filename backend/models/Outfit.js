// models/Outfit.js
const mongoose = require("mongoose");

const ClothingItemSchema = new mongoose.Schema({
  type:   { type: String, required: true },   // shirt, trouser, shoes, etc.
  color:  { type: String, default: "" },
  fabric: { type: String, default: "" },
  pattern:{ type: String, default: "" },
  fit:    { type: String, default: "" },
  brand:  { type: String, default: "" },
  price:  { type: Number, default: null },
  image:  { type: String, default: "" },
}, { _id: false });

const OutfitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide an outfit name"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    imageUrl: { type: String, default: "", trim: true },
    occasion: {
      type: String,
      required: [true, "Please specify an occasion"],
      enum: ["formal","casual","ethnic","party","date","brunch","travel","sports"],
      lowercase: true,
    },
    subOccasion: { type: String, default: "", lowercase: true, trim: true },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      lowercase: true,
      trim: true,
    },
    weather: {
      type: [String],
      enum: ["summer","winter","monsoon","spring","autumn","all"],
      default: ["all"],
    },
    style: { type: String, default: "", trim: true },
    description: { type: String, default: "", maxlength: [500, "Description cannot exceed 500 characters"] },
    items: { type: [ClothingItemSchema], default: [] },
    colorPalette: { type: [String], default: [] },
    styleTags:    { type: [String], default: [] },
    price:        { type: Number, default: null },
    sourceLink:   { type: String, default: "", trim: true },
    tags:         { type: [String], default: [] },
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    featured:     { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

OutfitSchema.index({ occasion: 1 });
OutfitSchema.index({ category: 1 });
OutfitSchema.index({ occasion: 1, category: 1 });
OutfitSchema.index({ weather: 1 });
OutfitSchema.index({ featured: 1 });
OutfitSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Outfit", OutfitSchema);