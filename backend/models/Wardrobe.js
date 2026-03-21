// models/Wardrobe.js
const mongoose = require("mongoose");

const WardrobeItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:   { type: String, required: true, trim: true },
    type:   { type: String, required: true, trim: true },   // shirt, jeans, etc.
    color:  { type: String, default: "", trim: true },
    fabric: { type: String, default: "" },
    brand:  { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    tags:   { type: [String], default: [] },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

WardrobeItemSchema.index({ userId: 1 });

module.exports = mongoose.model("WardrobeItem", WardrobeItemSchema);