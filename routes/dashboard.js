const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, dashboardController.renderDashboard);
router.post('/upload', isAuthenticated, dashboardController.uploadFile);
router.get('/chart-data', isAuthenticated, dashboardController.getChartData);

module.exports = router;
