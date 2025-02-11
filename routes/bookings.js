const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { isAuthenticated } = require('../middleware/auth');

// Get user's bookings
router.get('/my-bookings', isAuthenticated, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('event')
            .sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new booking
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { eventId, tickets } = req.body;
        
        // Check event availability
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check capacity
        const bookedTickets = await Booking.aggregate([
            { $match: { event: event._id, status: 'confirmed' } },
            { $group: { _id: null, total: { $sum: '$tickets' } } }
        ]);

        const totalBooked = bookedTickets[0]?.total || 0;
        if (totalBooked + tickets > event.capacity) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        // Create booking
        const booking = new Booking({
            user: req.user._id,
            event: eventId,
            tickets,
            status: 'pending'
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 