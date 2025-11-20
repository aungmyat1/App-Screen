const express = require('express');
const router = express.Router();
const screenshotController = require('../controllers/screenshotController');
const auth = require('../middleware/auth');
const checkSubscription = require('../middleware/subscription');

// Request screenshots (protected, requires at least free subscription)
router.post('/', auth, checkSubscription('free'), screenshotController.requestScreenshots);

// Get screenshot job status (protected)
router.get('/:id', auth, screenshotController.getJobStatus);

// Get user's screenshot jobs (protected)
router.get('/', auth, screenshotController.getUserJobs);

module.exports = router;