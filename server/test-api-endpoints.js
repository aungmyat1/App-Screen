// Test script for Braintree API endpoints
const http = require('http');

console.log('Testing Braintree API endpoints...');

// Test 1: Health check endpoint
const options1 = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

const req1 = http.request(options1, res1 => {
  console.log('\n1. Health Check Endpoint:');
  console.log('Status Code:', res1.statusCode);
  
  let data1 = '';
  res1.on('data', chunk => {
    data1 += chunk;
  });
  
  res1.on('end', () => {
    try {
      const result = JSON.parse(data1);
      console.log('Response:', JSON.stringify(result, null, 2));
    } catch (e) {
      console.log('Response:', data1);
    }
  });
});

req1.on('error', error => {
  console.error('Error:', error.message);
});

req1.end();