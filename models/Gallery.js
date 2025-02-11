const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    era: { type: String, enum: ['prehistoric', 'medieval', 'future'], required: true },
    imageUrl: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema); 