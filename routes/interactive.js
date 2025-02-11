const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: './public/images/gallery',
    filename: function(req, file, cb) {
        cb(null, 'gallery-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Store gallery items (in a real app, this would be in a database)
let galleryItems = [];
let votes = {
    prehistoric: 0,
    medieval: 0,
    future: 0
};

// Photo Gallery Routes
router.post('/gallery/upload', upload.single('photo'), (req, res) => {
    if (req.file) {
        galleryItems.push({
            id: Date.now(),
            image: `/images/gallery/${req.file.filename}`,
            caption: req.body.caption,
            era: req.body.era,
            votes: 0
        });
        res.redirect('/gallery');
    }
});

router.get('/gallery', (req, res) => {
    res.render('gallery', {
        title: 'Time Travel Gallery',
        photos: galleryItems
    });
});

// Voting Routes
router.post('/vote/:era', (req, res) => {
    const era = req.params.era;
    if (votes.hasOwnProperty(era)) {
        votes[era]++;
        res.json({ success: true, votes: votes[era] });
    } else {
        res.status(400).json({ success: false, message: 'Invalid era' });
    }
});

module.exports = router; 