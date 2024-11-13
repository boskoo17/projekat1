const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');

// Middleware for authentication
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

const isLoggedOut = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    res.redirect('/dashboard');
};

// Public routes
router.get('/login', isLoggedOut, authController.loginPage);
router.post('/login', isLoggedOut, authController.login);
router.get('/register', isLoggedOut, authController.registerPage);
router.post('/register', isLoggedOut, authController.register);

// Protected route
router.get('/dashboard', isAuthenticated, dashboardController.renderDashboard);

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.redirect('/');
    });
});

module.exports = router;
