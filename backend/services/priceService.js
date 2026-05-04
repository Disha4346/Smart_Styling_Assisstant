const priceService = {
    // Mocking a sophisticated price fetch from major e-commerce platforms
    fetchPrices: async (itemType, brand) => {
        const stores = [
            { name: 'Amazon', factor: 0.88, rating: 4.5, shipping: 'Free' },
            { name: 'Myntra', factor: 1.05, rating: 4.8, shipping: '₹40' },
            { name: 'Ajio', factor: 0.92, rating: 4.2, shipping: 'Free' },
            { name: 'Flipkart', factor: 0.98, rating: 4.4, shipping: '₹20' }
        ];

        const itemBasePrices = {
            'Shirt': 1200,
            'Trousers': 1800,
            'Blazer': 4500,
            'Shoes': 2500,
            'Suit Jacket': 5500,
            'Dress Shirt': 1500,
            'Silk Blouse': 2200,
            'Oxford Shoes': 3200,
            'Pointed Heels': 2800
        };

        const basePrice = itemBasePrices[itemType] || 2000;

        const results = stores.map(store => {
            const variance = 0.95 + Math.random() * 0.1; // small variance
            const price = Math.round(basePrice * store.factor * variance);
            
            return {
                storeName: store.name,
                price: price,
                rating: store.rating,
                shipping: store.shipping,
                buyLink: `https://www.${store.name.toLowerCase()}.com/search?q=${encodeURIComponent(brand + ' ' + itemType)}`,
                currency: 'INR',
                timestamp: new Date().toISOString()
            };
        });

        return results.sort((a, b) => a.price - b.price);
    }
};

module.exports = priceService;
