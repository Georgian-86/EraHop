const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const { sendRegistrationEmail, verifyConnection } = require('../utils/emailService');

// Test email configuration route should be first
router.get('/test-email-config', async (req, res) => {
    try {
        console.log('Testing email configuration...');
        console.log('Email User:', process.env.EMAIL_USER);
        console.log('Email Password length:', process.env.EMAIL_PASSWORD?.length || 0);

        const isConfigValid = await verifyConnection();
        if (isConfigValid) {
            res.json({
                success: true,
                message: 'Email configuration is valid',
                emailUser: process.env.EMAIL_USER
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Email configuration is invalid'
            });
        }
    } catch (error) {
        console.error('Email config test error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Test email sending route
router.get('/test-email', async (req, res) => {
    try {
        const testRegistration = {
            name: "Test User",
            email: "optimus4586prime@gmail.com",
            ticketType: "all-access",
            quantity: 1,
            totalAmount: 299,
            _id: "TEST123"
        };

        await sendRegistrationEmail(testRegistration);
        res.json({ 
            success: true, 
            message: 'Test email sent successfully' 
        });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// View all registrations route
router.get('/all', async (req, res) => {
    try {
        const registrations = await Registration.find()
            .sort({ registrationDate: -1 })
            .select('-__v'); // Exclude version key

        console.log('Found registrations:', registrations.length);
        
        res.json({
            success: true,
            count: registrations.length,
            registrations
        });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registrations',
            error: error.message
        });
    }
});

// Create new registration route
router.post('/', async (req, res) => {
    try {
        console.log('Registration attempt:', req.body);
        const { name, email, phone, ticketType, quantity, totalAmount } = req.body;

        // Validate fields
        if (!name || !email || !phone || !ticketType || !quantity || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Create and save registration
        const registration = new Registration({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            ticketType,
            quantity: Number(quantity),
            totalAmount: Number(totalAmount)
        });

        const savedRegistration = await registration.save();
        console.log('Registration saved:', savedRegistration);

        // Send email
        try {
            await sendRegistrationEmail(savedRegistration);
            console.log('Confirmation email sent to:', savedRegistration.email);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful! Check your email for confirmation.',
            registration: savedRegistration
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'This email is already registered'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// View specific registration route - should be last to avoid conflicting with other routes
router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching registration:', req.params.id);
        
        const registration = await Registration.findById(req.params.id)
            .select('-__v'); // Exclude version key

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.json({
            success: true,
            registration
        });
    } catch (error) {
        console.error('Error fetching registration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registration',
            error: error.message
        });
    }
});

// Add this route to resend confirmation email
router.get('/:id/resend-email', async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        await sendRegistrationEmail(registration);
        res.json({
            success: true,
            message: 'Confirmation email resent successfully'
        });
    } catch (error) {
        console.error('Failed to resend email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resend email',
            error: error.message
        });
    }
});

module.exports = router; 