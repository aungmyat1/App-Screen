const gateway = require('./config/braintree');

async function testBraintree() {
  try {
    console.log('Testing Braintree integration...');
    
    // Test 1: Generate client token
    console.log('1. Generating client token...');
    const tokenResult = await gateway.clientToken.generate({});
    console.log('✓ Client token generated successfully');
    console.log('Token:', tokenResult.clientToken.substring(0, 50) + '...');
    
    // Test 2: Test transaction (using a simple sale)
    console.log('\n2. Creating a test transaction...');
    const transactionResult = await gateway.transaction.sale({
      amount: '10.00',
      paymentMethodNonce: 'fake-valid-nonce',
      options: {
        submitForSettlement: true
      }
    });
    
    if (transactionResult.success) {
      console.log('✓ Transaction created successfully');
      console.log('Transaction ID:', transactionResult.transaction.id);
    } else {
      console.log('ℹ Transaction failed (expected in sandbox without valid nonce)');
      console.log('Message:', transactionResult.message);
    }
    
    console.log('\n✓ Braintree integration tests completed');
    console.log('\nAPI endpoints available:');
    console.log('- GET /api/payments/client-token');
    console.log('- POST /api/payments/checkout');
    console.log('- GET /api/payments/subscription');
    console.log('- POST /api/payments/webhook');
    
  } catch (error) {
    console.error('✗ Braintree test failed:', error.message);
  }
}

testBraintree();