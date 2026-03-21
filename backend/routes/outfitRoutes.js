// routes/outfitRoutes.js
const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/auth");
const {
  getAllOutfits, getOutfitsByOccasion, getOutfitsByCategory,
  getOutfitsBySubOccasion, getOutfitById, getOccasionsMeta,
  createOutfit, deleteOutfit,
} = require("../controllers/outfitController");

// Public
router.get("/",                                    getAllOutfits);
router.get("/meta/occasions",                      getOccasionsMeta);
router.get("/occasion/:occasion",                  getOutfitsByOccasion);
router.get("/occasion/:occasion/sub/:subOccasion", getOutfitsBySubOccasion);
router.get("/category/:category",                  getOutfitsByCategory);
router.get("/:id",                                 getOutfitById);

// Protected
router.post("/",    protect, createOutfit);
router.delete("/:id", protect, deleteOutfit);

module.exports = router;