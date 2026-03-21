// controllers/outfitController.js
const Outfit = require("../models/Outfit");

const fmt = (o) => ({
  id: o._id, name: o.name, imageUrl: o.imageUrl,
  occasion: o.occasion, subOccasion: o.subOccasion,
  category: o.category, weather: o.weather, style: o.style,
  description: o.description, items: o.items,
  colorPalette: o.colorPalette, styleTags: o.styleTags,
  price: o.price, sourceLink: o.sourceLink,
  tags: o.tags, rating: o.rating, featured: o.featured,
  createdAt: o.createdAt,
});

// GET /api/outfits
const getAllOutfits = async (req, res) => {
  try {
    const { search, featured, weather, limit = 60, page = 1 } = req.query;
    const filter = {};
    if (search) filter.$text = { $search: search };
    if (featured === "true") filter.featured = true;
    if (weather) filter.weather = { $in: [weather.toLowerCase(), "all"] };
    const skip  = (Number(page)-1)*Number(limit);
    const total = await Outfit.countDocuments(filter);
    const data  = await Outfit.find(filter).sort({ featured:-1, createdAt:-1 }).skip(skip).limit(Number(limit));
    res.json({ success:true, count:data.length, total, page:Number(page), pages:Math.ceil(total/Number(limit)), data:data.map(fmt) });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

// GET /api/outfits/occasion/:occasion
const getOutfitsByOccasion = async (req, res) => {
  try {
    const valid = ["formal","casual","ethnic","party","date","brunch","travel","sports"];
    const occ = req.params.occasion.toLowerCase();
    if (!valid.includes(occ)) return res.status(400).json({ success:false, message:`Invalid occasion. Valid: ${valid.join(", ")}` });
    const { category, subOccasion, weather, limit=60 } = req.query;
    const filter = { occasion: occ };
    if (category)    filter.category    = category.toLowerCase();
    if (subOccasion) filter.subOccasion = subOccasion.toLowerCase();
    if (weather)     filter.weather     = { $in: [weather.toLowerCase(), "all"] };
    const data = await Outfit.find(filter).sort({ featured:-1, createdAt:-1 }).limit(Number(limit));
    const grouped = data.reduce((acc, o) => {
      const k = o.category; if (!acc[k]) acc[k] = [];
      acc[k].push(fmt(o)); return acc;
    }, {});
    res.json({ success:true, occasion:occ, count:data.length, grouped, data:data.map(fmt) });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

// GET /api/outfits/category/:category
const getOutfitsByCategory = async (req, res) => {
  try {
    const cat  = req.params.category.toLowerCase().replace(/-/g," ");
    const data = await Outfit.find({ category:cat }).sort({ featured:-1, createdAt:-1 }).limit(60);
    res.json({ success:true, category:cat, count:data.length, data:data.map(fmt) });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

// GET /api/outfits/occasion/:occasion/sub/:subOccasion
const getOutfitsBySubOccasion = async (req, res) => {
  try {
    const { occasion, subOccasion } = req.params;
    const data = await Outfit.find({
      occasion: occasion.toLowerCase(),
      subOccasion: subOccasion.toLowerCase().replace(/-/g," "),
    }).sort({ featured:-1, createdAt:-1 }).limit(30);
    res.json({ success:true, occasion, subOccasion, count:data.length, data:data.map(fmt) });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

// GET /api/outfits/:id
const getOutfitById = async (req, res) => {
  try {
    const o = await Outfit.findById(req.params.id);
    if (!o) return res.status(404).json({ success:false, message:"Outfit not found" });
    res.json({ success:true, data:fmt(o) });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

// GET /api/outfits/meta/occasions
const getOccasionsMeta = async (req, res) => {
  try {
    const occasions    = await Outfit.distinct("occasion");
    const categories   = await Outfit.distinct("category");
    const subOccasions = await Outfit.distinct("subOccasion");
    const grouped = {};
    for (const occ of occasions) {
      grouped[occ] = await Outfit.distinct("category", { occasion:occ });
    }
    res.json({ success:true, occasions, categories, subOccasions, grouped });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

// POST /api/outfits  (protected)
const createOutfit = async (req, res) => {
  try {
    const o = await Outfit.create(req.body);
    res.status(201).json({ success:true, data:fmt(o) });
  } catch (e) {
    if (e.name==="ValidationError") {
      return res.status(400).json({ success:false, message:Object.values(e.errors).map(x=>x.message).join(", ") });
    }
    res.status(500).json({ success:false, message:e.message });
  }
};

// DELETE /api/outfits/:id  (protected)
const deleteOutfit = async (req, res) => {
  try {
    const o = await Outfit.findByIdAndDelete(req.params.id);
    if (!o) return res.status(404).json({ success:false, message:"Outfit not found" });
    res.json({ success:true, message:"Outfit deleted" });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

module.exports = { getAllOutfits, getOutfitsByOccasion, getOutfitsByCategory, getOutfitsBySubOccasion, getOutfitById, getOccasionsMeta, createOutfit, deleteOutfit };