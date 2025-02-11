const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const mongoose = require('mongoose');
// Temporarily remove authentication requirement
// const { isAuthenticated } = require('../middleware/auth');

// Get cart items
router.get('/', async (req, res) => {
    try {
        // Use a temporary test user ID
        let cart = await Cart.findOne({ userId: "test-user-id" });
        if (!cart) {
            cart = { items: [], total: 0 };
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        console.log('Received cart request:', req.body);
        const { title, price, type, quantity } = req.body;
        
        if (!title || !price || !type || !quantity) {
            console.log('Missing required fields:', { title, price, type, quantity });
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate price and quantity are numbers
        if (isNaN(price) || isNaN(quantity)) {
            return res.status(400).json({ message: 'Price and quantity must be numbers' });
        }

        // Validate type is either 'pass' or 'merchandise'
        if (!['pass', 'merchandise'].includes(type)) {
            return res.status(400).json({ message: 'Invalid item type' });
        }

        let cart = await Cart.findOne({ userId: "test-user-id" });
        console.log('Found existing cart:', cart);
        
        if (!cart) {
            console.log('Creating new cart');
            cart = new Cart({
                userId: "test-user-id",
                items: [],
                total: 0
            });
        }

        // Check if item already exists
        const existingItem = cart.items.find(item => item.title === title);
        console.log('Existing item:', existingItem);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const newItem = {
                title,
                price: Number(price),
                quantity: Number(quantity),
                type,
                image: `/images/shop/${type}/${title.toLowerCase().replace(/\s+/g, '-')}.jpg`
            };
            console.log('Adding new item:', newItem);
            cart.items.push(newItem);
        }

        // Update total using the calculateTotal method
        cart.calculateTotal();
        console.log('Updated cart before save:', cart);
        
        const savedCart = await cart.save();
        console.log('Cart saved successfully:', savedCart);
        
        res.json({
            message: 'Item added to cart',
            totalItems: savedCart.items.reduce((sum, item) => sum + item.quantity, 0),
            cart: savedCart
        });
    } catch (error) {
        console.error('Cart error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            body: req.body
        });

        // Send appropriate error response
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid cart data' });
        } else if (error.name === 'MongoServerError') {
            return res.status(503).json({ message: 'Database error' });
        }
        
        res.status(500).json({ message: 'Failed to add item to cart' });
    }
});

// Update cart item quantity
router.put('/update/:itemId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ userId: "test-user-id" });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.id(req.params.itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        item.quantity = quantity;
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove item from cart
router.delete('/remove/:itemId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: "test-user-id" });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 