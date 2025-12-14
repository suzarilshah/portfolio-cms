import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier, apiRateLimiter, createRateLimitResponse } from './rate-limiter';
import { InMemoryRateLimiter } from './rate-limiter';
import { addDefaultSecurityHeaders, addFullSecurityHeaders } from './headers';
import { stackServerApp } from '@/stack';

export interface SecurityMiddlewareOptions {
  requireAuth?: boolean;
  rateLimit?: {
    windowMs?: number;
    maxRequests?: number;
  };
  validateContentType?: boolean;
  allowedMethods?: string[];
  requireCSRF?: boolean;
}

export class SecurityMiddleware {
  static async handle(
    request: NextRequest,
    options: SecurityMiddlewareOptions = {}
  ): Promise<NextResponse | null> {
    const {
      requireAuth = false,
      rateLimit,
      validateContentType = true,
      allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      requireCSRF = false
    } = options;

    // CSRF protection for state-changing requests (only if explicitly enabled)
    if (requireCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const origin = request.headers.get('origin');
      const referer = request.headers.get('referer');
      const host = request.headers.get('host');

      // Skip CSRF check for API-to-API requests (server-side)
      if (request.headers.get('x-requested-with') === 'XMLHttpRequest') {
        // Allow AJAX requests
      } else {
        if (!origin && !referer) {
          return NextResponse.json(
            { error: 'CSRF validation failed: Missing origin/referer' },
            { status: 403 }
          );
        }

        if (origin && !origin.includes(host || '')) {
          return NextResponse.json(
            { error: 'CSRF validation failed: Invalid origin' },
            { status: 403 }
          );
        }
      }
    }

    // Method validation
    if (!allowedMethods.includes(request.method)) {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Rate limiting
    const identifier = getClientIdentifier(request);
    const limiter = rateLimit 
      ? new InMemoryRateLimiter(
          rateLimit.windowMs || 60000,
          rateLimit.maxRequests || 100
        )
      : apiRateLimiter;

    const rateLimitResult = limiter.check(identifier);
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult.resetTime);
    }

    // Content-Type validation for POST/PUT requests
    if (validateContentType && ['POST', 'PUT'].includes(request.method)) {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return NextResponse.json(
          { error: 'Invalid Content-Type. Expected application/json' },
          { status: 400 }
        );
      }
    }

    // Authentication check
    if (requireAuth) {
      try {
        const user = await stackServerApp.getUser();
        if (!user) {
          return NextResponse.json(
            { error: 'Authorization required' },
            { status: 401 }
          );
        }
      } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
          { error: 'Authorization required' },
          { status: 401 }
        );
      }
    }

    return null; // Continue to the actual handler
  }

  static async handleAPIRoute(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>,
    options: SecurityMiddlewareOptions = {}
  ): Promise<NextResponse> {
    // Apply security middleware
    const securityResult = await this.handle(request, options);
    if (securityResult) {
      return securityResult;
    }

    try {
      // Execute the actual handler
      const response = await handler(request);

      // Add security headers
      return addDefaultSecurityHeaders(response);
    } catch (error) {
      console.error('API Route Error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}

// Helper function to create secure API route handlers
export function createSecureAPIHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: SecurityMiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    return SecurityMiddleware.handleAPIRoute(request, handler, options);
  };
}
