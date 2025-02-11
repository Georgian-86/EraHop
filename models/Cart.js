const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: String,
    type: {
        type: String,
        required: true,
        enum: ['pass', 'merchandise']
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add a method to calculate total
cartSchema.methods.calculateTotal = function() {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return this.total;
};

module.exports = mongoose.model('Cart', cartSchema); 