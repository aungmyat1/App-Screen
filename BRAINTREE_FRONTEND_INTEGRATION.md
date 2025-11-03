# Frontend Braintree Integration Guide

This guide explains how to integrate Braintree payment processing in the frontend of the AppScreens application.

## Installation

The Braintree JavaScript SDK is loaded via CDN. Include this in your HTML:

```html
<script src="https://js.braintreegateway.com/web/dropin/1.32.1/js/dropin.min.js"></script>
```

For React applications, you can install the Braintree Web Drop-in React component:

```bash
npm install braintree-web-drop-in-react
```

## Integration Steps

1. Fetch a client token from the backend
2. Initialize the Braintree client SDK
3. Create a payment form using Drop-in UI or Hosted Fields
4. Submit the payment method nonce to the backend

## Example Implementation for React

Here's a complete example of how to integrate Braintree payments in a React component:

```tsx
import React, { useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';
import DropIn from 'braintree-web-drop-in-react';
import paymentService from '../services/paymentService';

const BraintreePaymentForm = ({ plan, onSuccess, onError }) => {
  const [clientToken, setClientToken] = useState(null);
  const [instance, setInstance] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const { clientToken } = await paymentService.getClientToken();
        setClientToken(clientToken);
      } catch (error) {
        onError('Failed to initialize payment form');
      }
    };

    fetchClientToken();
  }, [onError]);

  const handlePayment = async () => {
    if (!instance) return;
    
    setIsProcessing(true);
    
    try {
      // Get payment method nonce from Drop-in
      const payload = await instance.requestPaymentMethod();
      
      // Send nonce to backend for processing
      const result = await paymentService.createTransaction(plan, payload.nonce);
      
      if (result.success) {
        onSuccess();
      } else {
        onError(result.message || 'Payment failed');
      }
    } catch (error) {
      onError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!clientToken) {
    return <div>Loading payment form...</div>;
  }

  return (
    <div>
      <h2>Complete Your Purchase</h2>
      <DropIn
        options={{ authorization: clientToken }}
        onInstance={setInstance}
      />
      <button 
        onClick={handlePayment} 
        disabled={isProcessing || !instance}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : `Pay Now`}
      </button>
    </div>
  );
};

export default BraintreePaymentForm;
```

## Example Implementation for Vanilla JavaScript

```javascript
// Fetch client token from your backend
async function fetchClientToken() {
  const response = await fetch('/api/payments/client-token');
  const { clientToken } = await response.json();
  return clientToken;
}

// Initialize Braintree Drop-in
async function initializeBraintree() {
  const clientToken = await fetchClientToken();
  
  braintree.dropin.create({
    authorization: clientToken,
    container: '#dropin-container',
    vaultManager: false
  }, function (createErr, instance) {
    if (createErr) {
      console.error('Error creating Drop-in:', createErr);
      return;
    }
    
    // Enable the submit button
    document.getElementById('submit-button').disabled = false;
    
    // Handle form submission
    document.getElementById('submit-button').addEventListener('click', function () {
      instance.requestPaymentMethod(function (err, payload) {
        if (err) {
          console.error('Error:', err);
          return;
        }
        
        // Send nonce to your server
        processPayment(payload.nonce);
      });
    });
  });
}

// Process payment with nonce
async function processPayment(nonce) {
  const response = await fetch('/api/payments/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` // If using authentication
    },
    body: JSON.stringify({
      plan: 'starter', // Selected plan
      paymentMethodNonce: nonce
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    alert('Payment successful!');
  } else {
    alert('Payment failed: ' + result.message);
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeBraintree);
```

## Testing

For testing purposes, use the following sandbox credit card details:

- Card Number: 4111 1111 1111 1111
- Expiration Date: 12/25
- CVV: 123

## Error Handling

Always handle errors appropriately in your UI:

1. Network errors when fetching the client token
2. Validation errors in the payment form
3. Processing errors when submitting payments
4. Server errors when processing transactions

## Security Considerations

1. Never log or store payment method nonces
2. Always use HTTPS in production
3. Validate all data both on frontend and backend
4. Follow PCI DSS compliance guidelines

## Customization

You can customize the Drop-in UI by passing additional options:

```javascript
const dropinInstance = await braintree.dropin.create({
  authorization: clientToken,
  container: '#braintree-dropin',
  paypal: {
    flow: 'vault'
  },
  venmo: {
    allowNewBrowserTab: false
  },
  applePay: {
    displayName: 'AppScreens',
    paymentRequest: {
      total: {
        label: 'AppScreens Subscription',
        amount: '10.00'
      }
    }
  }
});
```

## Webhook Handling

For handling webhooks, you'll need to set up an endpoint on your server that can receive and process webhook notifications from Braintree. The webhook URL should be configured in your Braintree control panel.

Refer to the [Braintree JavaScript SDK documentation](https://developer.paypal.com/braintree/docs/start/hello-client/javascript/v3) for more customization options.