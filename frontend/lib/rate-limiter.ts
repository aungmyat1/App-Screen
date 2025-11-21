// Rate limiter utility for API endpoints

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  
  // Default configuration
  private windowMs: number = 15 * 60 * 1000; // 15 minutes
  private maxRequests: number = 100; // Max requests per window
  
  constructor(windowMs?: number, maxRequests?: number) {
    if (windowMs) this.windowMs = windowMs;
    if (maxRequests) this.maxRequests = maxRequests;
  }
  
  // Check if a request is allowed
  isAllowed(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const window = this.requests.get(key);
    
    // If no record exists or window has expired, create new record
    if (!window || window.resetTime <= now) {
      const resetTime = now + this.windowMs;
      this.requests.set(key, { count: 1, resetTime });
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime
      };
    }
    
    // Increment request count
    window.count++;
    this.requests.set(key, window);
    
    // Check if limit exceeded
    if (window.count > this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: window.resetTime
      };
    }
    
    return {
      allowed: true,
      remaining: this.maxRequests - window.count,
      resetTime: window.resetTime
    };
  }
  
  // Reset counter for a key
  reset(key: string): void {
    this.requests.delete(key);
  }
  
  // Get current count for a key
  getCount(key: string): number {
    const window = this.requests.get(key);
    return window ? window.count : 0;
  }
  
  // Clean up old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, window] of this.requests.entries()) {
      if (window.resetTime <= now) {
        this.requests.delete(key);
      }
    }
  }
}

// Predefined rate limiters for different use cases
export const AuthRateLimiter = new RateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes
export const ApiRateLimiter = new RateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const DownloadRateLimiter = new RateLimiter(60 * 1000, 10); // 10 requests per minute

// Generic rate limiter function
export function createRateLimiter(windowMs: number, maxRequests: number): RateLimiter {
  return new RateLimiter(windowMs, maxRequests);
}

export default RateLimiter;