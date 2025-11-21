// Billing service for handling subscriptions, payments, and invoices

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  maxApps: number;
  maxScreenshots: number;
  supportLevel: 'basic' | 'priority' | 'dedicated';
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'void';
  issuedAt: Date;
  dueAt: Date;
  paidAt?: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_account' | 'paypal';
  isDefault: boolean;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
}

// Mock data for demonstration
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Up to 5 apps',
      '100 screenshots per month',
      'Basic support'
    ],
    maxApps: 5,
    maxScreenshots: 100,
    supportLevel: 'basic'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    features: [
      'Up to 50 apps',
      'Unlimited screenshots',
      'Priority support',
      'Advanced analytics'
    ],
    maxApps: 50,
    maxScreenshots: Infinity,
    supportLevel: 'priority'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    features: [
      'Unlimited apps',
      'Unlimited screenshots',
      'Dedicated support',
      'Advanced analytics',
      'Custom integrations'
    ],
    maxApps: Infinity,
    maxScreenshots: Infinity,
    supportLevel: 'dedicated'
  }
];

class BillingService {
  private baseUrl = '/api/billing';

  // Get all subscription plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      // In a real implementation, this would call your backend API
      return SUBSCRIPTION_PLANS;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw new Error('Failed to fetch subscription plans');
    }
  }

  // Get user's current subscription
  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No subscription found
        }
        throw new Error('Failed to fetch subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      throw new Error('Failed to fetch current subscription');
    }
  }

  // Create or update subscription
  async updateSubscription(
    userId: string, 
    planId: string,
    paymentMethodId?: string
  ): Promise<Subscription> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId,
          paymentMethodId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  // Get user's invoices
  async getInvoices(userId: string): Promise<Invoice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/invoices?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw new Error('Failed to fetch invoices');
    }
  }

  // Get user's payment methods
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error('Failed to fetch payment methods');
    }
  }

  // Add a new payment method
  async addPaymentMethod(
    userId: string,
    paymentMethod: Omit<PaymentMethod, 'id' | 'userId'>
  ): Promise<PaymentMethod> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...paymentMethod
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add payment method');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw new Error('Failed to add payment method');
    }
  }

  // Set default payment method
  async setDefaultPaymentMethod(
    userId: string,
    paymentMethodId: string
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods/${paymentMethodId}/default`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to set default payment method');
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw new Error('Failed to set default payment method');
    }
  }

  // Process a payment
  async processPayment(
    userId: string,
    amount: number,
    currency: string = 'USD',
    paymentMethodId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount,
          currency,
          paymentMethodId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error processing payment:', error);
      return { success: false, error: 'Failed to process payment' };
    }
  }
}

export default new BillingService();