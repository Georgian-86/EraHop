const mongoose = require('mongoose');

const scheduleBookingSchema = new mongoose.Schema({
    eventTime: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    era: {
        type: String,
        required: true,
        enum: ['prehistoric', 'medieval', 'future']
    },
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'confirmed',
        enum: ['pending', 'confirmed', 'cancelled']
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ScheduleBooking', scheduleBookingSchema); 