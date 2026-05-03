const express = require('express');
const router = express.Router();
const priceService = require('../services/priceService');

// Get price comparison for an item
router.get('/compare', async (req, res) => {
    try {
        const { itemType, brand } = req.query;
        if (!itemType) {
            return res.status(400).json({ error: 'itemType is required' });
        }

        const prices = await priceService.fetchPrices(itemType, brand || '');
        res.status(200).json({
            item: itemType,
            brand: brand,
            comparisons: prices,
            lowestPrice: prices[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
