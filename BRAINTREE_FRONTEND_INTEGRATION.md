# Frontend Braintree Integration Guide

This guide explains how to integrate Braintree payment processing in the frontend of the AppScreens application.

## Installation

The Braintree JavaScript SDK is already included in the project dependencies. If you need to install it separately, you can do so with:

```bash
npm install braintree-web
```

## Integration Steps

1. Fetch a client token from the backend
2. Initialize the Braintree client SDK
3. Create a payment form using Drop-in UI or Hosted Fields
4. Submit the payment method nonce to the backend

## Example Implementation

Here's a complete example of how to integrate Braintree payments in a React component:

```tsx
import React, { useEffect, useState } from 'react';
import braintree from 'braintree-web';
import paymentService from '../services/paymentService';

const PaymentForm = ({ plan, onSuccess, onError }) => {
  const [instance, setInstance] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const initializeBraintree = async () => {
      try {
        // Fetch client token from backend
        const { clientToken } = await paymentService.getClientToken();
        
        // Initialize Braintree Drop-in
        const dropinInstance = await braintree.dropin.create({
          authorization: clientToken,
          container: '#braintree-dropin',
          vaultManager: false
        });
        
        setInstance(dropinInstance);
      } catch (error) {
        onError('Failed to initialize payment form');
      }
    };

    initializeBraintree();

    // Cleanup function
    return () => {
      if (instance) {
        instance.teardown();
      }
    };
  }, [onError]);

  const handleSubmit = async () => {
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

  return (
    <div>
      <div id="braintree-dropin"></div>
      <button 
        onClick={handleSubmit} 
        disabled={isProcessing || !instance}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : `Pay Now`}
      </button>
    </div>
  );
};

export default PaymentForm;
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

Refer to the [Braintree JavaScript SDK documentation](https://developer.paypal.com/braintree/docs/start/hello-client/javascript/v3) for more customization options.