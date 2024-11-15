const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Your auth routes
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser'); // Import CSV parser
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Uploaded files will go into an 'uploads' folder

const app = express();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // User is authenticated, proceed to the next middleware
    } else {
        return res.redirect('/login'); // User is not logged in, redirect to login page
    }
}

// Route to handle file upload
app.post('/dashboard/upload', isAuthenticated, upload.single('dataFile'), (req, res) => {
    if (!req.file) {
        return res.redirect('/dashboard');
    }

    req.session.filePath = req.file.path; // Store file path in session
    req.session.csvData = null; // Reset csvData to reparse on display
    req.session.uploadMessage = "File uploaded successfully!";
    res.redirect('/dashboard');
});

// Route to render the dashboard with CSV data
app.get('/dashboard', isAuthenticated, (req, res) => {
    const csvData = req.session.csvData || null; // If CSV data exists in session, use it
    const uploadMessage = req.session.uploadMessage || null; // Show upload success message

    res.render('dashboard', {
        user: req.session.user,
        csvData: csvData,
        displayRequested: true,
        uploadMessage: uploadMessage // Display upload message on dashboard
    });

    req.session.uploadMessage = null; // Reset the message after rendering
});

// Route to handle the display of CSV data after it's uploaded
app.get('/dashboard/display', isAuthenticated, (req, res) => {
    try {
        // Check if a file path is stored in the session
        if (!req.session.filePath) {
            return res.render('dashboard', { user: req.session.user, csvData: null, displayRequested: true });
        }

        // Initialize an empty array to hold the CSV data
        let csvData = [];

        // Attempt to read the CSV file
        fs.createReadStream(req.session.filePath)
            .pipe(csv())
            .on('data', (row) => {
                csvData.push(row); // Add each row to csvData array
            })
            .on('end', () => {
                req.session.csvData = csvData; // Store parsed data in the session
                res.render('dashboard', { user: req.session.user, csvData, displayRequested: true });
            })
            .on('error', (error) => {
                console.error("Error reading the CSV file:", error);
                res.render('dashboard', { user: req.session.user, csvData: null, displayRequested: true });
            });
    } catch (error) {
        console.error("Unexpected error displaying CSV data:", error);
        res.status(500).send("An error occurred while displaying the CSV data.");
    }
});

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware to manage user sessions
app.use(session({
    secret: 'your_secret_key', // Replace with your own secret
    resave: false,
    saveUninitialized: true
}));

// Set views and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Landing page route
app.get('/', (req, res) => {
    res.render('index');
});

// Use auth routes
app.use('/', authRoutes);

// Start server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

