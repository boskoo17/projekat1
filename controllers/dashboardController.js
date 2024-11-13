const fs = require('fs');
const csv = require('csv-parser');

exports.renderDashboard = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    let csvData = [];

    // If there's an uploaded CSV file, parse it
    if (req.session.filePath) {
        fs.createReadStream(req.session.filePath)
            .pipe(csv())
            .on('data', (row) => csvData.push(row))
            .on('end', () => {
                // Pass parsed CSV data to the dashboard view
                res.render('dashboard', { user: req.session.user, csvData });
            });
    } else {
        // Render dashboard without CSV data
        res.render('dashboard', { user: req.session.user, csvData: null });
    }
};
