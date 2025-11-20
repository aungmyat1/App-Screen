const braintree = require('braintree');
const User = require('../models/User');

// Initialize Braintree gateway
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox, // Use braintree.Environment.Production for production
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

// Get client token for Braintree
exports.getClientToken = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({});
    res.json({ clientToken: response.clientToken });
  } catch (error) {
    console.error('Braintree client token error:', error);
    res.status(500).json({ message: 'Error generating client token' });
  }
};

// Process subscription payment
exports.processSubscription = async (req, res) => {
  try {
    const { paymentMethodNonce, planId } = req.body;
    
    // In a real implementation, you would map planId to actual Braintree plans
    // For now, we'll just simulate the process
    
    // Create customer in Braintree
    const customerResult = await gateway.customer.create({
      firstName: req.user.name.split(' ')[0],
      lastName: req.user.name.split(' ')[1] || '',
      email: req.user.email,
      paymentMethodNonce: paymentMethodNonce
    });
    
    if (!customerResult.success) {
      return res.status(400).json({ 
        message: 'Error creating customer', 
        errors: customerResult.errors.deepErrors() 
      });
    }
    
    const customerId = customerResult.customer.id;
    
    // Update user with Braintree customer ID
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'subscription.braintreeCustomerId': customerId,
        'subscription.plan': planId // In real implementation, validate this
      },
      { new: true }
    ).select('-password');
    
    res.json({
      message: 'Subscription processed successfully',
      user
    });
  } catch (error) {
    console.error('Subscription processing error:', error);
    res.status(500).json({ message: 'Error processing subscription' });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.subscription.braintreeCustomerId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }
    
    // In a real implementation, you would cancel the Braintree subscription
    // For now, we'll just update the user's plan
    
    user.subscription.plan = 'free';
    await user.save();
    
    res.json({
      message: 'Subscription cancelled successfully',
      user: await user.populate().execPopulate()
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({ message: 'Error cancelling subscription' });
  }
};