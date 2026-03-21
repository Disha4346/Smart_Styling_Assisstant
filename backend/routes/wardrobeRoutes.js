// routes/wardrobeRoutes.js
const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/auth");
const { getWardrobe, addItem, removeItem } = require("../controllers/Wardrobecontroller");

router.use(protect); // all wardrobe routes require auth

router.get("/",       getWardrobe);
router.post("/",      addItem);
router.delete("/:id", removeItem);

module.exports = router;