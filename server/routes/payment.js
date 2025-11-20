const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Get client token for Braintree (protected)
router.get('/client-token', auth, paymentController.getClientToken);

// Process subscription payment (protected)
router.post('/subscribe', auth, paymentController.processSubscription);

// Cancel subscription (protected)
router.post('/cancel', auth, paymentController.cancelSubscription);

module.exports = router;