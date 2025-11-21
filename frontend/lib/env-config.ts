// Environment configuration utility for managing secrets and configuration

class EnvConfig {
  // Client-side environment variables (NEXT_PUBLIC_)
  public static readonly NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  public static readonly NEXT_PUBLIC_APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'development';
  public static readonly NEXT_PUBLIC_STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY || '';
  
  // Server-side only environment variables (not included in client bundle)
  private static readonly SERVER_ENV_VARS = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    BRAINTREE_MERCHANT_ID: process.env.BRAINTREE_MERCHANT_ID,
    BRAINTREE_PUBLIC_KEY: process.env.BRAINTREE_PUBLIC_KEY,
    BRAINTREE_PRIVATE_KEY: process.env.BRAINTREE_PRIVATE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    BRAINTREE_WEBHOOK_SECRET: process.env.BRAINTREE_WEBHOOK_SECRET,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    REDIS_URL: process.env.REDIS_URL,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
  };

  // Get a server-side environment variable
  public static getServerVar(name: keyof typeof this.SERVER_ENV_VARS): string | undefined {
    // In a real server-side implementation, this would return the actual value
    // For client-side demo purposes, we're returning undefined for all server vars
    return undefined;
  }

  // Check if we're in production
  public static isProduction(): boolean {
    return this.NEXT_PUBLIC_APP_ENV === 'production';
  }

  // Check if we're in development
  public static isDevelopment(): boolean {
    return this.NEXT_PUBLIC_APP_ENV === 'development';
  }

  // Check if we're in staging
  public static isStaging(): boolean {
    return this.NEXT_PUBLIC_APP_ENV === 'staging';
  }

  // Get current environment
  public static getEnvironment(): string {
    return this.NEXT_PUBLIC_APP_ENV;
  }

  // Validate required environment variables
  public static validateEnvVars(): { valid: boolean; missing: string[] } {
    const requiredPublicVars = [
      'NEXT_PUBLIC_API_URL',
    ];
    
    const missing: string[] = [];
    
    requiredPublicVars.forEach(varName => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });
    
    return {
      valid: missing.length === 0,
      missing
    };
  }

  // Get API base URL
  public static getApiBaseUrl(): string {
    return this.NEXT_PUBLIC_API_URL;
  }

  // Get Braintree configuration
  public static getBraintreeConfig() {
    return {
      merchantId: this.getServerVar('BRAINTREE_MERCHANT_ID') || '',
      publicKey: this.NEXT_PUBLIC_STRIPE_KEY, // Using Stripe key as placeholder
      privateKey: this.getServerVar('BRAINTREE_PRIVATE_KEY') || '',
    };
  }

  // Get database configuration
  public static getDatabaseConfig() {
    return {
      url: this.getServerVar('DATABASE_URL') || 'mongodb://localhost:27017/appscreen',
    };
  }

  // Get Redis configuration
  public static getRedisConfig() {
    return {
      url: this.getServerVar('REDIS_URL') || 'redis://localhost:6379',
    };
  }

  // Get email configuration
  public static getEmailConfig() {
    return {
      server: this.getServerVar('EMAIL_SERVER') || 'smtp://localhost:1025',
      from: this.getServerVar('EMAIL_FROM') || 'noreply@appscreen.com',
    };
  }
}

export default EnvConfig;