const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');

// Add debug logging
const debug = require('debug')('app:server');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Add debug logging for routes
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Available Routes:', app._router.stack
        .filter(r => r.route)
        .map(r => ({
            path: r.route.path,
            method: Object.keys(r.route.methods)[0]
        }))
    );
    next();
});

// Add this before the registration route
app.use((req, res, next) => {
    console.log('Incoming request:', {
        url: req.url,
        method: req.method,
        path: req.path
    });
    next();
});

// API Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');
const galleryRoutes = require('./routes/gallery');
const cartRoutes = require('./routes/cart');
const registrationRoutes = require('./routes/registrations');
const scheduleRoutes = require('./routes/schedule');

// Use routes
app.use('/events', eventRoutes);  // This should handle /events/register
app.use('/api/registration', registrationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/interactive/gallery', galleryRoutes);
app.use('/api/schedule', scheduleRoutes);

// Page Routes
app.get('/', (req, res) => {
    res.render('home', { 
        title: 'TimeFest 2024',
        layout: 'main'
    });
});

// Move all /events routes together in this order
// Most specific routes first, then dynamic routes

// 1. First, specific event routes
app.get('/events/register', (req, res, next) => {
    console.log('Attempting to render registration page');
    try {
        res.render('events/register', {
            title: 'Register - TimeFest 2024',
            layout: 'main'
        });
    } catch (error) {
        console.error('Error rendering registration:', error);
        next(error);
    }
});

app.get('/events/schedule', (req, res, next) => {
    try {
        res.render('events/schedule', { 
            title: 'Event Schedule - TimeFest 2024',
            layout: 'main',
            isSchedulePage: true
        });
    } catch (error) {
        console.error('Error rendering schedule:', error);
        next(error);
    }
});

app.get('/events/timezones', (req, res, next) => {
    try {
        res.render('events/timezones', {
            title: 'Time Zones - TimeFest 2024',
            layout: 'main',
            isTimezonePage: true
        });
    } catch (error) {
        console.error('Error rendering timezones:', error);
        next(error);
    }
});

// 2. Then the dynamic era route
app.get('/events/:era', (req, res, next) => {
    const validEras = ['prehistoric', 'medieval', 'future'];
    const era = req.params.era;
    
    if (!validEras.includes(era)) {
        return res.status(404).render('404');
    }
    
    try {
        res.render(`events/${era}`, {
            title: `${era.charAt(0).toUpperCase() + era.slice(1)} Era - TimeFest 2024`,
            layout: 'main'
        });
    } catch (error) {
        console.error(`Error rendering ${era} era:`, error);
        next(error);
    }
});

// 3. Finally, the base events route
app.get('/events', (req, res) => {
    res.render('events/index', {
        title: 'Events - TimeFest 2024',
        layout: 'main'
    });
});

// Handlebars setup
const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        eq: (a, b) => a === b,
        formatDate: (date) => new Date(date).toLocaleDateString(),
        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
        eraDescription: (era) => {
            const descriptions = {
                prehistoric: 'Journey back to when dinosaurs ruled the Earth',
                medieval: 'Experience the age of knights and castles',
                future: 'Explore the cutting-edge technology of tomorrow'
            };
            return descriptions[era] || '';
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Interactive Routes
app.get('/interactive/map', (req, res, next) => {
    try {
        res.render('interactive/map', {
            title: 'Time Map - TimeFest 2024',
            layout: 'main'
        });
    } catch (error) {
        console.error('Error rendering map:', error);
        next(error);
    }
});

app.get('/interactive/vote', (req, res, next) => {
    try {
        res.render('interactive/vote', {
            title: 'Vote Events - TimeFest 2024',
            layout: 'main'
        });
    } catch (error) {
        console.error('Error rendering vote:', error);
        next(error);
    }
});

// Shop Routes
app.get('/shop', (req, res, next) => {
    try {
        res.render('shop/index', {
            title: 'Shop - TimeFest 2024',
            layout: 'main'
        });
    } catch (error) {
        console.error('Error rendering shop:', error);
        next(error);
    }
});

app.get('/shop/cart', (req, res, next) => {
    try {
        res.render('shop/cart', {
            title: 'Shopping Cart - TimeFest 2024',
            layout: 'main'
        });
    } catch (error) {
        console.error('Error rendering cart:', error);
        next(error);
    }
});

// Registration Route
app.get('/admin/registrations', (req, res) => {
    res.render('admin/registrations', {
        title: 'Registration Management - TimeFest 2024',
        layout: 'main'
    });
});

// Test upload page route
app.get('/test-upload', (req, res) => {
    res.render('test-upload', {
        title: 'Test Upload - TimeFest 2024',
        layout: 'main'
    });
});

// Test route for MongoDB connection
app.get('/api/test', async (req, res) => {
    try {
        const testCart = new Cart({
            userId: "test-user",
            items: [],
            total: 0
        });
        await testCart.save();
        res.json({ message: 'Database test successful', cart: testCart });
    } catch (error) {
        console.error('Test route error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Test registration endpoint
app.get('/test-registration', async (req, res) => {
    try {
        // Test database connection
        await mongoose.connection.db.admin().ping();
        console.log('Database connection verified');

        const testRegistration = new Registration({
            name: "Test User",
            email: "test@example.com",
            phone: "1234567890",
            ticketType: "all-access",
            quantity: 1,
            totalAmount: 299
        });
        await testRegistration.save();
        res.json({ success: true, message: 'Test registration successful' });
    } catch (error) {
        console.error('Test registration error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            details: 'Database or connection error'
        });
    }
});

// Example API endpoint
app.post('/api/events/book', async (req, res) => {
    try {
        const { eventId, userId, tickets } = req.body;
        const booking = new Booking({
            event: eventId,
            user: userId,
            tickets,
            status: 'confirmed'
        });
        await booking.save();
        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test registration endpoint
app.post('/api/registration/test-direct', (req, res) => {
    console.log('Direct registration test hit');
    console.log('Body:', req.body);
    res.json({ 
        message: 'Direct registration route working',
        receivedData: req.body 
    });
});

// Error handling middleware should be last
app.use((err, req, res, next) => {
    console.error('Detailed error:', err);
    res.status(500).render('error', {
        message: err.message || 'Something broke!',
        error: JSON.stringify(err, null, 2),
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
});

// 404 handler should be very last
app.use((req, res) => {
    res.status(404).render('404', {
        message: 'Page not found'
    });
});

// Add static middleware for images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Add default image fallback
app.use('/images', (req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public/images/default.jpg'));
});

// Database connection
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'timefest',
    retryWrites: true,
    w: 'majority'
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        console.log('Database connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.log('Check your connection string and make sure your IP is whitelisted');
    });

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Models
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const Gallery = require('./models/Gallery');
const Cart = require('./models/Cart');
const Registration = require('./models/Registration');
const ScheduleBooking = require('./models/ScheduleBooking');

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Views directory: ${path.join(__dirname, 'views')}`);
}); 