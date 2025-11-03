// src/components/BraintreePaymentForm.tsx

import React, { useState, useEffect } from 'react';
import paymentService from '../services/paymentService';

interface Props {
  plan: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const BraintreePaymentForm: React.FC<Props> = ({ plan, onPaymentSuccess, onPaymentError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientToken, setClientToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const { clientToken } = await paymentService.getClientToken();
        setClientToken(clientToken);
      } catch (error) {
        onPaymentError('Failed to initialize payment form');
      }
    };

    fetchClientToken();
  }, [onPaymentError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    // Note: In a real implementation, you would integrate with the Braintree
    // Drop-in UI or Hosted Fields here to collect payment details
    // and obtain a paymentMethodNonce
    
    // For demo purposes, we'll simulate this step
    try {
      // This is where you would get the nonce from the Braintree UI
      const paymentMethodNonce = 'fake-nonce'; // Replace with actual nonce
      
      const result = await paymentService.createTransaction(plan, paymentMethodNonce);
      
      if (result.success) {
        onPaymentSuccess();
      } else {
        onPaymentError(result.message || 'Payment failed');
      }
    } catch (error) {
      onPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!clientToken) {
    return <div>Loading payment form...</div>;
  }

  return (
    <div>
      <h3>Complete Your Purchase</h3>
      <p>Plan: {plan}</p>
      
      {/* In a real implementation, you would render the Braintree Drop-in UI here */}
      <div id="braintree-dropin"></div>
      
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default BraintreePaymentForm;