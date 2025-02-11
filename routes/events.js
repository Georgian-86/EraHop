const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Store events data (in a real app, this would be in a database)
const events = [
    {
        id: 1,
        era: 'prehistoric',
        name: 'Dinosaur Hunt VR Experience',
        description: 'Experience the thrill of the Jurassic period in virtual reality',
        time: '10:00 AM',
        location: 'Cave Arena',
        capacity: 30,
        registrations: 0
    },
    {
        id: 2,
        era: 'medieval',
        name: 'Knights Tournament',
        description: 'Watch or participate in our medieval jousting competition',
        time: '2:00 PM',
        location: 'Castle Grounds',
        capacity: 50,
        registrations: 0
    },
    {
        id: 3,
        era: 'future',
        name: 'Robot Wars',
        description: 'Build and battle with your own robot in our tech arena',
        time: '4:00 PM',
        location: 'Tech Dome',
        capacity: 40,
        registrations: 0
    }
];

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get events by era
router.get('/era/:era', async (req, res) => {
    try {
        const events = await Event.find({ era: req.params.era });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new event (admin only)
router.post('/', isAdmin, async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update event (admin only)
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get registration form for specific event
router.get('/register/:id', (req, res) => {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) return res.status(404).send('Event not found');
    
    res.render('register', { 
        title: `Register for ${event.name}`,
        event: event
    });
});

// Handle event registration
router.post('/register/:id', (req, res) => {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) return res.status(404).send('Event not found');
    
    if (event.registrations >= event.capacity) {
        return res.status(400).send('Event is full');
    }
    
    // In a real app, save to database
    event.registrations++;
    
    res.redirect('/events');
});

module.exports = router; 