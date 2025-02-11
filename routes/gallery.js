const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Gallery = require('../models/Gallery');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Test upload endpoint
router.post('/test-upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Upload to Cloudinary
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'timefest/test',
            resource_type: 'auto'
        });

        res.json({ 
            message: 'Upload successful',
            url: result.secure_url
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Main gallery page
router.get('/', async (req, res) => {
    try {
        const items = await Gallery.find().sort({ uploadDate: -1 });
        console.log('Rendering gallery page');
        
        res.render('interactive/gallery', {
            title: 'Photo Gallery - TimeFest 2024',
            layout: 'main',
            showUploadButton: true, // Always show upload button for testing
            items: items
        });
    } catch (error) {
        console.error('Gallery page error:', error);
        res.status(500).render('error', { message: error.message });
    }
});

// API endpoint for uploading images
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: `timefest/${req.body.era}`,
            resource_type: 'auto'
        });

        const galleryItem = new Gallery({
            title: req.body.title,
            description: req.body.description,
            era: req.body.era,
            imageUrl: result.secure_url
        });

        await galleryItem.save();
        res.status(201).json(galleryItem);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 