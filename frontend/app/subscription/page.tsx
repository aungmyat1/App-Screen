'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckIcon,
  CreditCardIcon
} from 'lucide-react';
import { PaymentForm } from '@/components/payment-form';
import { apiService } from '@/lib/api';

export default function Subscription() {
  const { user, refreshUser } = useAuth();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{id: string, name: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubscribe = (planId: string, planName: string) => {
    setSelectedPlan({ id: planId, name: planName });
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentForm(false);
    setSelectedPlan(null);
    setSuccess('Subscription successful!');
    setError(null);
    
    // Refresh user data to show updated subscription
    try {
      await refreshUser();
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
    
    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(null), 5000);
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setSelectedPlan(null);
  };

  const handleCancelSubscription = async () => {
    try {
      await apiService.cancelSubscription();
      setSuccess('Subscription cancelled successfully!');
      setError(null);
      
      // Refresh user data
      await refreshUser();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel subscription');
    }
  };

  if (!user) {
    return null;
  }

  const currentPlan = user.subscription?.plan || 'free';

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Up to 10 downloads per month',
        'Standard quality screenshots',
        'Basic app store support',
        'Email support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      features: [
        'Up to 100 downloads per month',
        'High quality screenshots',
        'All app stores supported',
        'Priority email support',
        'Batch processing',
        'ZIP file organization'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$29.99',
      period: 'per month',
      features: [
        'Unlimited downloads',
        'Highest quality screenshots',
        'All app stores supported',
        '24/7 priority support',
        'Advanced batch processing',
        'Custom ZIP organization',
        'API access',
        'Team collaboration'
      ]
    }
  ];

  if (showPaymentForm && selectedPlan) {
    return (
      <div className="max-w-2xl mx-auto">
        <PaymentForm 
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-muted-foreground">
          Choose the plan that best fits your needs
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 text-green-500 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col ${currentPlan === plan.id ? 'border-primary' : ''}`}
          >
            <CardHeader>
              {currentPlan === plan.id && (
                <div className="flex items-center text-primary text-sm mb-2">
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Your current plan
                </div>
              )}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground"> {plan.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {currentPlan === plan.id ? (
                plan.id !== 'free' ? (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                )
              ) : (
                <Button 
                  className="w-full"
                  onClick={() => handleSubscribe(plan.id, plan.name)}
                >
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Upgrade to {plan.name}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>
            Your current subscription information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Current Plan</h3>
              <p className="text-2xl font-bold capitalize">{currentPlan}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Downloads Used</h3>
              <p className="text-2xl font-bold">
                {user.downloadCount || 0} <span className="text-muted-foreground text-lg">/ {
                  currentPlan === 'free' ? '10' : 
                  currentPlan === 'pro' ? '100' : '∞'
                }</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}