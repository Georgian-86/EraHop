const express = require('express');
const router = express.Router();

// Store products (in a real app, this would be in a database)
const products = [
    {
        id: 'ticket-basic',
        name: 'Basic Time Travel Pass',
        price: 2000, // $20.00
        description: 'Access to all basic events'
    },
    {
        id: 'ticket-vip',
        name: 'VIP Time Travel Pass',
        price: 5000, // $50.00
        description: 'VIP access to all events plus exclusive merchandise'
    },
    {
        id: 'merch-tshirt',
        name: 'Time Travel T-Shirt',
        price: 2500, // $25.00
        description: 'Limited edition fest t-shirt',
        sizes: ['S', 'M', 'L', 'XL']
    }
];

// Main shop page
router.get('/', (req, res) => {
    res.render('shop', {
        title: 'Time Travel Shop',
        products: products
    });
});

// Cart page
router.get('/cart', (req, res) => {
    res.render('shop/cart', {
        title: 'Shopping Cart',
        products: products
    });
});

// Success page
router.get('/success', (req, res) => {
    res.render('shop/success', {
        title: 'Order Successful'
    });
});

// Cancel/Failed page
router.get('/cancel', (req, res) => {
    res.render('shop/cancel', {
        title: 'Order Cancelled'
    });
});

// Checkout process
router.post('/checkout', (req, res) => {
    const { items, customerInfo } = req.body;
    
    // Basic validation
    if (!items || !items.length || !customerInfo) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid order data' 
        });
    }

    // Here you would:
    // 1. Validate stock availability
    // 2. Save order to database
    // 3. Send confirmation email
    
    res.json({ 
        success: true, 
        message: 'Order placed successfully',
        orderId: Date.now() // Generate proper order ID in production
    });
});

module.exports = router; 