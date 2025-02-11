const express = require('express');
const router = express.Router();
const ScheduleBooking = require('../models/ScheduleBooking');

// Get all bookings for a user
router.get('/bookings/:userId', async (req, res) => {
    try {
        const bookings = await ScheduleBooking.find({ userId: req.params.userId })
            .sort({ bookingDate: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create new booking
router.post('/book', async (req, res) => {
    try {
        console.log('Received booking request:', req.body);
        const { eventTime, eventName, era, userId } = req.body;
        
        // Validate required fields
        if (!eventTime || !eventName || !era || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate era value
        const validEras = ['prehistoric', 'medieval', 'future'];
        if (!validEras.includes(era)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid era value'
            });
        }

        // Create new booking
        const booking = new ScheduleBooking({
            eventTime,
            eventName,
            era,
            userId
        });

        await booking.save();
        console.log('Booking saved successfully:', booking);

        res.json({ 
            success: true, 
            message: 'Event booked successfully',
            booking 
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to create booking'
        });
    }
});

module.exports = router; 