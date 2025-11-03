const express = require('express');
const router = express.Router();
const { generateToken, createTransaction, handleWebhook, getSubscription } = require('../controllers/payment.controller');
const auth = require('../middleware/auth');

// Generate client token (public)
router.get('/client-token', generateToken);

// Create transaction (protected)
router.post('/checkout', auth, createTransaction);

// Get subscription details (protected)
router.get('/subscription', auth, getSubscription);

// Webhook endpoint (unprotected, secured by webhook signature)
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

module.exports = router;