// middleware/auth.js

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // User is logged in, proceed to the next middleware or route handler
    }
    res.redirect('/login'); // User is not logged in, redirect to login page
};

const isLoggedOut = (req, res, next) => {
    if (!req.session.user) {
        return next(); // User is not logged in, proceed to the next middleware or route handler
    }
    res.redirect('/dashboard'); // User is already logged in, redirect to dashboard
};

module.exports = { isAuthenticated, isLoggedOut };
