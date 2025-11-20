'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CreditCardIcon, 
  CheckIcon,
  LogOutIcon,
  RefreshCwIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';

export default function Subscription() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSubscribe = async (planId: string) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Get client token for Braintree
      const { clientToken } = await apiService.getClientToken();
      
      // In a real implementation, you would integrate with the Braintree SDK
      // to collect payment information and process the subscription
      // For this demo, we'll simulate the process
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful subscription
      setSuccess(`Successfully subscribed to ${planId} plan!`);
      
      // Refresh user data
      await refreshUser();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await apiService.cancelSubscription();
      setSuccess('Subscription cancelled successfully!');
      
      // Refresh user data
      await refreshUser();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      setIsRefreshing(true);
      // In a real implementation, you would refresh the user context
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

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
      ],
      cta: 'Current Plan',
      disabled: currentPlan === 'free'
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
      ],
      cta: 'Upgrade to Pro',
      disabled: currentPlan === 'pro'
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
      ],
      cta: 'Upgrade to Enterprise',
      disabled: currentPlan === 'enterprise'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AppScreens</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
            <p className="text-muted-foreground">
              Choose the plan that best fits your needs
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 text-green-500 rounded-lg">
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
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            Cancelling...
                          </div>
                        ) : (
                          'Cancel Subscription'
                        )}
                      </Button>
                    ) : (
                      <Button className="w-full" disabled>
                        Current Plan
                      </Button>
                    )
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isLoading || plan.disabled}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CreditCardIcon className="h-5 w-5 mr-2" />
                          {plan.cta}
                        </div>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-10">
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
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={refreshUser}
                  disabled={isRefreshing}
                >
                  <RefreshCwIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}