# Braintree Payment Gateway Integration

This document explains how to set up and use Braintree as the payment gateway for the AppScreens application.

## Prerequisites

1. A Braintree account (sign up at https://www.braintreepayments.com/)
2. Your Merchant ID, Public Key, and Private Key from the Braintree dashboard

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env` file in the `server` directory:

```
BRAINTREE_MERCHANT_ID=your_actual_merchant_id
BRAINTREE_PUBLIC_KEY=your_actual_public_key
BRAINTREE_PRIVATE_KEY=your_actual_private_key
BRAINTREE_ENVIRONMENT=Sandbox
```

Replace `your_actual_merchant_id`, `your_actual_public_key`, and `your_actual_private_key` with your actual Braintree credentials.

For production, change the environment to:
```
BRAINTREE_ENVIRONMENT=Production
```

### 2. Available API Endpoints

#### GET `/api/payments/client-token`
Generates a client token that is required to initialize the Braintree client SDK on the frontend.

#### POST `/api/payments/checkout`
Processes a payment transaction using a payment method nonce.

Request Body:
```json
{
  "plan": "starter|professional|enterprise",
  "paymentMethodNonce": "nonce_from_braintree_client"
}
```

#### GET `/api/payments/subscription`
Retrieves the authenticated user's subscription details.

#### POST `/api/payments/webhook`
Endpoint for Braintree webhook notifications. This handles events like subscription activations, cancellations, and payment success/failure.

### 3. Frontend Integration

1. Fetch a client token from `/api/payments/client-token`
2. Initialize the Braintree client SDK with the token
3. Collect payment details using Drop-in UI or Hosted Fields
4. Send the payment method nonce to `/api/payments/checkout` with the selected plan

Example JavaScript code:
```javascript
// Fetch client token
const tokenResponse = await fetch('/api/payments/client-token');
const { clientToken } = await tokenResponse.json();

// Initialize Braintree
braintree.dropin.create({
  authorization: clientToken,
  container: '#dropin-container'
}, (createErr, instance) => {
  // Handle payment submission
  document.querySelector('#submit-button').addEventListener('click', () => {
    instance.requestPaymentMethod((err, payload) => {
      // Send nonce to backend
      fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          plan: 'starter', // Selected plan
          paymentMethodNonce: payload.nonce
        })
      });
    });
  });
});
```

### 4. Testing

For testing, use the following sandbox credit card details:
- Card Number: 4111 1111 1111 1111
- Expiration Date: 12/25
- CVV: 123

### 5. Webhook Configuration

In your Braintree control panel, configure the webhook URL to point to:
```
https://yourdomain.com/api/payments/webhook
```

The webhook handler supports the following event types:
- Subscription Went Active
- Subscription Canceled
- Subscription Charged Successfully
- Subscription Charged Unsuccessfully

## Migration from Stripe

If you're migrating from Stripe:
1. The plan configuration in `server/config/plans.js` remains the same
2. The subscription data structure in the User model is compatible
3. The frontend service (`src/services/paymentService.ts`) has been updated to work with Braintree
4. Routes have been updated to match Braintree's workflow

## Testing the Integration

To test if your Braintree integration is properly configured:

1. Make sure you've added your actual Braintree credentials to the `.env` file
2. Run the test script:
   ```
   cd server
   node test-braintree.js
   ```

If the test is successful, you'll see a message indicating that the Braintree integration is ready.

## Troubleshooting

### Common Issues

1. **"Missing publicKey" error**: Check that your Braintree credentials are properly set in the `.env` file
2. **"Invalid Signature" error**: Check that your Braintree credentials are correct
3. **CORS issues**: Ensure your domain is whitelisted in the Braintree control panel
4. **Webhook verification failing**: Make sure the webhook URL is publicly accessible

### Logs

Check server logs for detailed error messages. All payment-related errors are logged to the console.