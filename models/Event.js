const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    era: { type: String, enum: ['prehistoric', 'medieval', 'future'], required: true },
    date: { type: Date, required: true },
    capacity: Number,
    price: Number,
    image: String,
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
});

module.exports = mongoose.model('Event', eventSchema); 