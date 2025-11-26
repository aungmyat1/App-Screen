'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import billingService, { SUBSCRIPTION_PLANS } from '@/lib/billing';

export default function BillingPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState(SUBSCRIPTION_PLANS);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        if (user?.id) {
          const subscription = await billingService.getCurrentSubscription(user.id);
          setCurrentSubscription(subscription);
        }
      } catch (err) {
        setError('Failed to load billing information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingInfo();
  }, [user]);

  const handleSubscribe = async (planId: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const subscription = await billingService.updateSubscription(user.id, planId);
      setCurrentSubscription(subscription);
    } catch (err) {
      setError('Failed to update subscription');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!currentSubscription?.id) return;
    
    try {
      setLoading(true);
      await billingService.cancelSubscription(currentSubscription.id);
      // Refresh subscription info
      if (user?.id) {
        const subscription = await billingService.getCurrentSubscription(user.id);
        setCurrentSubscription(subscription);
      }
    } catch (err) {
      setError('Failed to cancel subscription');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Billing</h1>
        </div>
      </header>
      
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="text-sm font-medium text-red-800">{error}</div>
            </div>
          )}
          
          <div className="px-4 py-6 sm:px-0">
            {currentSubscription ? (
              <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Subscription</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Plan</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {plans.find(p => p.id === currentSubscription.planId)?.name || 'Unknown Plan'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {currentSubscription.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Billing Period</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(currentSubscription.currentPeriodStart).toLocaleDateString()} -{' '}
                      {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Auto-renewal</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {currentSubscription.cancelAtPeriodEnd ? 'No' : 'Yes'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  {currentSubscription.cancelAtPeriodEnd ? (
                    <button
                      onClick={() => handleSubscribe(currentSubscription.planId)}
                      disabled={loading}
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                      {loading ? 'Processing...' : 'Re-enable Auto-renewal'}
                    </button>
                  ) : (
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-400"
                    >
                      {loading ? 'Processing...' : 'Cancel Subscription'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">No Active Subscription</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You don't have an active subscription. Choose a plan below to get started.
                </p>
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Plans</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-lg border p-6 shadow-sm ${
                    currentSubscription?.planId === plan.id
                      ? 'border-indigo-500 ring-2 ring-indigo-500 dark:border-indigo-400 dark:ring-indigo-400'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="mt-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/{plan.interval}</span>
                  </p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    {currentSubscription?.planId === plan.id ? (
                      <button
                        disabled
                        className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                      >
                        Current Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={loading}
                        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                      >
                        {loading ? 'Processing...' : 'Choose Plan'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}