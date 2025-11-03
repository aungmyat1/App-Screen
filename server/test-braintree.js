const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const braintree = require('braintree');
const gateway = require('./config/braintree');

async function testBraintreeConnection() {
  try {
    console.log('Testing Braintree connection...');
    console.log('Merchant ID:', process.env.BRAINTREE_MERCHANT_ID ? 'Set' : 'Not set');
    console.log('Public Key:', process.env.BRAINTREE_PUBLIC_KEY ? 'Set' : 'Not set');
    console.log('Private Key:', process.env.BRAINTREE_PRIVATE_KEY ? 'Set' : 'Not set');
    
    // Test generating a client token
    const tokenResult = await gateway.clientToken.generate({});
    console.log('✓ Client token generated successfully');
    
    console.log('\nBraintree integration is ready!');
    console.log('- Use the /api/payments/client-token endpoint to generate client tokens');
    console.log('- Use the /api/payments/checkout endpoint to process payments');
    console.log('- Configure webhooks in your Braintree dashboard to point to /api/payments/webhook');
    
  } catch (error) {
    console.error('✗ Braintree connection failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check that your BRAINTREE_MERCHANT_ID, BRAINTREE_PUBLIC_KEY, and BRAINTREE_PRIVATE_KEY are correctly set in your .env file');
    console.log('2. Ensure you have network connectivity to Braintree servers');
    console.log('3. Verify your credentials are correct in the Braintree dashboard');
  }
}

testBraintreeConnection();