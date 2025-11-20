import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Define types for our API responses
export interface User {
  id: string;
  name: string;
  email: string;
  subscription: {
    plan: string;
    braintreeCustomerId?: string;
    expiresAt?: string;
  };
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScreenshotJob {
  id: string;
  appId: string;
  appUrl: string;
  store: 'google' | 'apple';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateScreenshotData {
  url: string;
  store: 'google' | 'apple';
}

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // Create axios instance with default config
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add a request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  // Set authentication token
  setAuthToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Auth endpoints
  async register(data: RegisterData) {
    const response = await this.api.post<{ user: User; token: string }>('/auth/register', data);
    this.setAuthToken(response.data.token);
    return response.data;
  }

  async login(data: LoginData) {
    const response = await this.api.post<{ user: User; token: string }>('/auth/login', data);
    this.setAuthToken(response.data.token);
    return response.data;
  }

  async logout() {
    this.setAuthToken(null);
  }

  async getProfile() {
    const response = await this.api.get<User>('/users/profile');
    return response.data;
  }

  // Screenshot endpoints
  async requestScreenshots(data: CreateScreenshotData) {
    const response = await this.api.post<{ 
      id: string; 
      appId: string; 
      appUrl: string; 
      store: string; 
      status: string;
      message: string;
    }>('/screenshots', data);
    return response.data;
  }

  async getScreenshotJob(id: string) {
    const response = await this.api.get<ScreenshotJob>(`/screenshots/${id}`);
    return response.data;
  }

  async getUserScreenshotJobs() {
    const response = await this.api.get<ScreenshotJob[]>('/screenshots');
    return response.data;
  }

  async downloadScreenshots(jobId: string) {
    const response = await this.api.get(`/download/screenshots/${jobId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Payment endpoints
  async getClientToken() {
    const response = await this.api.get<{ clientToken: string }>('/payment/client-token');
    return response.data;
  }

  async subscribe(paymentMethodNonce: string, planId: string) {
    const response = await this.api.post('/payment/subscribe', {
      paymentMethodNonce,
      planId,
    });
    return response.data;
  }

  async cancelSubscription() {
    const response = await this.api.post('/payment/cancel');
    return response.data;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();