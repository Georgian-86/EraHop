const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'College Fest 2024',
        description: 'Join us for the biggest college festival of the year!'
    });
});

module.exports = router; 