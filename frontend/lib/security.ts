// Security utilities for implementing various protection mechanisms

// Content Security Policy (CSP) configuration
export const CSP_POLICY = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.braintreegateway.com https://*.paypal.com;
  frame-src 'self' https://*.braintreegateway.com https://*.paypal.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

// Security headers to be applied to all responses
export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': "geolocation=(), microphone=(), camera=()",
  'Content-Security-Policy': CSP_POLICY,
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  // Authentication endpoints
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
  },
  // General API endpoints
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  // File download endpoints
  DOWNLOAD: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
  }
};

// Input validation utilities
export class InputValidator {
  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static isValidPassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    if (!/\d/.test(password)) {
      return { valid: false, message: 'Password must contain at least one digit' };
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }
    
    return { valid: true };
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // Validate UUID format
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

// Session management utilities
export class SessionManager {
  // Generate a secure session token
  static generateSessionToken(): string {
    // In a real implementation, you would use a cryptographically secure method
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Validate session token
  static validateSessionToken(token: string): boolean {
    // In a real implementation, you would check against stored tokens
    return typeof token === 'string' && token.length > 10;
  }

  // Hash sensitive data
  static hashData(data: string): string {
    // In a real implementation, you would use a proper hashing algorithm like bcrypt
    // This is just a placeholder
    return btoa(data).split('').reverse().join('');
  }
}

// Data protection utilities
export class DataProtection {
  // Mask sensitive data like credit card numbers
  static maskCreditCard(cardNumber: string): string {
    if (!cardNumber) return '';
    
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length < 4) return cleaned;
    
    return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
  }

  // Mask email address
  static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return '';
    
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) {
      return `${'*'.repeat(localPart.length)}@${domain}`;
    }
    
    return `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}@${domain}`;
  }
}

export default {
  CSP_POLICY,
  SECURITY_HEADERS,
  RATE_LIMIT_CONFIG,
  InputValidator,
  SessionManager,
  DataProtection
};