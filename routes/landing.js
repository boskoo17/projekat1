// routes/landing.js

const express = require('express');
const router = express.Router();

// Route for landing page
router.get('/', (req, res) => {
    res.render('index'); // Ensure you have an index.ejs file in the views folder
});

module.exports = router;
