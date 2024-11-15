//THIS!!!

// // Render the dashboard with default values
// app.get('/dashboard', isAuthenticated, (req, res) => {
//     res.render('dashboard', { user: req.session.user, csvData: req.session.csvData || null, displayRequested: false });
// });

// // Route to display the uploaded CSV file data
// app.get('/dashboard/display', isAuthenticated, (req, res) => {
//     if (!req.session.filePath) {
//         return res.render('dashboard', { user: req.session.user, csvData: null, displayRequested: true });
//     } 

//     let csvData = [];

//     fs.createReadStream(req.session.filePath)
//         .pipe(csv())
//         .on('data', (row) => csvData.push(row))
//         .on('end', () => {
//             req.session.csvData = csvData; // Save parsed data in session
//             res.render('dashboard', { user: req.session.user, csvData, displayRequested: true });
//         })
//         .on('error', (error) => {
//             console.error('Error parsing CSV:', error);
//             res.render('dashboard', { user: req.session.user, csvData: null, displayRequested: true });
//         });
// });
