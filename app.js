const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Your auth routes
const path = require('path');

const app = express();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Uploaded files will go into an 'uploads' folder

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // User is authenticated, proceed to the next middleware
    } else {
        return res.redirect('/login'); // User is not logged in, redirect to login page
    }
}


// Route for handling file upload
app.post('/dashboard/upload', isAuthenticated, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.redirect('/dashboard');
    }
    // Store file path in session for later use
    req.session.filePath = req.file.path;
    res.redirect('/dashboard');
});


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
