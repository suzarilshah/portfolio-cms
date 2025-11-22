import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// Rate limiters for different endpoints
export class InMemoryRateLimiter {
  private store = new Map<string, RateLimitStore>();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  check(identifier: string): { allowed: boolean; resetTime: number; remaining: number } {
    const now = Date.now();
    const key = identifier;
    
    if (!this.store.has(key)) {
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return { allowed: true, resetTime: now + this.windowMs, remaining: this.maxRequests - 1 };
    }

    const record = this.store.get(key)!;
    
    if (now > record.resetTime) {
      // Reset the window
      record.count = 1;
      record.resetTime = now + this.windowMs;
      return { allowed: true, resetTime: record.resetTime, remaining: this.maxRequests - 1 };
    }

    if (record.count >= this.maxRequests) {
      return { allowed: false, resetTime: record.resetTime, remaining: 0 };
    }

    record.count++;
    return { allowed: true, resetTime: record.resetTime, remaining: this.maxRequests - record.count };
  }

  // Cleanup expired entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Rate limiters for different endpoints
export const authRateLimiter = new InMemoryRateLimiter(15 * 60 * 1000, 10); // 10 requests per 15 minutes
export const apiRateLimiter = new InMemoryRateLimiter(60 * 1000, 100); // 100 requests per minute
export const uploadRateLimiter = new InMemoryRateLimiter(60 * 1000, 20); // 20 uploads per minute

// Cleanup expired entries every 5 minutes
setInterval(() => {
  authRateLimiter.cleanup();
  apiRateLimiter.cleanup();
  uploadRateLimiter.cleanup();
}, 5 * 60 * 1000);

export function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from auth headers first, fallback to IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  // Add user agent for better fingerprinting
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return `${ip}:${Buffer.from(userAgent).toString('base64').substring(0, 16)}`;
}

export function createRateLimitResponse(resetTime: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { 
      status: 429,
      headers: {
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(resetTime).toISOString(),
        'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
      }
    }
  );
}
