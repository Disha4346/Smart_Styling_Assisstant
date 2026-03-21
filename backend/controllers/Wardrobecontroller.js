// controllers/wardrobeController.js
const WardrobeItem = require("../models/Wardrobe");

const fmt = (item) => ({
  id: item._id, userId: item.userId, name: item.name,
  type: item.type, color: item.color, fabric: item.fabric,
  brand: item.brand, imageUrl: item.imageUrl, tags: item.tags,
  addedAt: item.addedAt,
});

// GET /api/wardrobe  — current user's wardrobe
const getWardrobe = async (req, res) => {
  try {
    const items = await WardrobeItem.find({ userId: req.user.id }).sort({ addedAt: -1 });
    res.json({ success: true, count: items.length, data: items.map(fmt) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// POST /api/wardrobe
const addItem = async (req, res) => {
  try {
    const item = await WardrobeItem.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: fmt(item) });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// DELETE /api/wardrobe/:id
const removeItem = async (req, res) => {
  try {
    const item = await WardrobeItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true, message: "Item removed" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { getWardrobe, addItem, removeItem };