'use client';

import { useState, useEffect, useRef } from 'react';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    braintree: any;
  }
}

interface PaymentFormProps {
  planId: string;
  planName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ planId, planName, onSuccess, onCancel }: PaymentFormProps) {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dropinContainerRef = useRef<HTMLDivElement>(null);
  const dropinInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initializeBraintree = async () => {
      try {
        const { clientToken } = await apiService.getClientToken();
        setClientToken(clientToken);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to initialize payment system');
      }
    };

    initializeBraintree();

    return () => {
      if (dropinInstanceRef.current) {
        dropinInstanceRef.current.teardown();
      }
    };
  }, []);

  useEffect(() => {
    if (clientToken && dropinContainerRef.current && window.braintree) {
      window.braintree.dropin.create({
        authorization: clientToken,
        container: dropinContainerRef.current,
        paypal: {
          flow: 'vault'
        }
      }, (createErr: any, instance: any) => {
        if (createErr) {
          setError('Failed to initialize payment form');
          console.error('Braintree Drop-in error:', createErr);
          return;
        }
        dropinInstanceRef.current = instance;
      });
    }
  }, [clientToken]);

  const handlePayment = async () => {
    if (!dropinInstanceRef.current) {
      setError('Payment form not initialized');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const payload = await dropinInstanceRef.current.requestPaymentMethod();
      
      await apiService.subscribe(payload.nonce, planId);
      
      onSuccess();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!clientToken) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscribe to {planName}</CardTitle>
        <CardDescription>
          Enter your payment information to subscribe to the {planName} plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div ref={dropinContainerRef} className="min-h-[300px]"></div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Subscribe to ${planName}`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}