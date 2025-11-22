import { NextRequest, NextResponse } from 'next/server';
import { addFullSecurityHeaders, addCORSHeaders } from '@/lib/security/headers';
import { getClientIdentifier, apiRateLimiter, createRateLimitResponse } from '@/lib/security/rate-limiter';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get client identifier for rate limiting
  const identifier = getClientIdentifier(request);
  
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const rateLimitResult = apiRateLimiter.check(identifier);
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult.resetTime);
    }
  }
  
  // Add security headers to all responses
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Enhanced security for admin routes
    addFullSecurityHeaders(response);
  } else {
    // Basic security for public routes
    addFullSecurityHeaders(response);
  }
  
  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    addCORSHeaders(response, {
      origins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://www.suzarilshah.uk',
        'https://suzarilshah.uk'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true
    });
  }
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
