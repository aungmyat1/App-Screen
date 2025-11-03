// src/services/paymentService.ts

interface SubscriptionDetails {
  plan: string;
  expiresAt: string;
  downloadLimit: number;
  downloadsUsed: number;
  downloadsRemaining: number;
}

interface ClientTokenResponse {
  clientToken: string;
}

interface TransactionResponse {
  success: boolean;
  transactionId?: string;
  message?: string;
}

class PaymentService {
  private baseUrl = '/api/payments';

  async getSubscription(): Promise<SubscriptionDetails> {
    const response = await fetch(`${this.baseUrl}/subscription`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription details');
    }

    return await response.json();
  }

  async getClientToken(): Promise<ClientTokenResponse> {
    const response = await fetch(`${this.baseUrl}/client-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch client token');
    }

    return await response.json();
  }

  async createTransaction(plan: string, paymentMethodNonce: string): Promise<TransactionResponse> {
    const response = await fetch(`${this.baseUrl}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ plan, paymentMethodNonce })
    });

    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }

    return await response.json();
  }
}

export default new PaymentService();