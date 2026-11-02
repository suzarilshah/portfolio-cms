import { NextRequest, NextResponse } from 'next/server';
import { getClientIdentifier, createRateLimitResponse, getRateLimiter } from './rate-limiter';
import { addDefaultSecurityHeaders } from './headers';
import { isAdminEmail } from './admin';
import { isSameOrigin } from './csrf';
import { stackServerApp } from '@/stack';

export interface SecurityMiddlewareOptions {
  requireAuth?: boolean;
  /** Requires a signed-in user whose email is on the admin allowlist. Implies requireAuth. */
  requireAdmin?: boolean;
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
      requireAdmin = false,
      requireAuth = requireAdmin,
      rateLimit,
      validateContentType = true,
      allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      requireCSRF = false
    } = options;

    // CSRF protection for state-changing requests (only if explicitly enabled)
    if (requireCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const sameOrigin = isSameOrigin(
        request.headers.get('origin'),
        request.headers.get('referer'),
        request.headers.get('host')
      );

      if (!sameOrigin) {
        return NextResponse.json(
          { error: 'CSRF validation failed: Invalid origin' },
          { status: 403 }
        );
      }
    }

    // Method validation
    if (!allowedMethods.includes(request.method)) {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Rate limiting. The edge middleware already applies the global API budget
    // to every /api/ path, so only a route-specific override runs here —
    // checking both would consume two slots per request.
    if (rateLimit) {
      const limiter = getRateLimiter(
        rateLimit.windowMs || 60000,
        rateLimit.maxRequests || 100
      );

      const rateLimitResult = limiter.check(getClientIdentifier(request));
      if (!rateLimitResult.allowed) {
        return createRateLimitResponse(rateLimitResult.resetTime);
      }
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

    // Authentication and authorization check
    if (requireAuth) {
      let user: Awaited<ReturnType<typeof stackServerApp.getUser>> = null;

      try {
        user = await stackServerApp.getUser();
      } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
          { error: 'Authorization required' },
          { status: 401 }
        );
      }

      if (!user) {
        return NextResponse.json(
          { error: 'Authorization required' },
          { status: 401 }
        );
      }

      // Signing in is not enough: writes are restricted to the allowlist, so a
      // self-registered Stack Auth account cannot reach the CMS.
      if (requireAdmin && !isAdminEmail(user.primaryEmail)) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
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
