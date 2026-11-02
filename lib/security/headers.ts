import { NextResponse } from 'next/server';

export interface SecurityHeaders {
  'Content-Security-Policy'?: string;
  'X-Frame-Options'?: string;
  'X-Content-Type-Options'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
  'Strict-Transport-Security'?: string;
  'X-XSS-Protection'?: string;
}

export class SecurityHeadersBuilder {
  private headers: SecurityHeaders = {};

  // Content Security Policy
  withCSP(): this {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.credly.com https://*.stack.inc https://*.stack-auth.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.stack.inc https://*.stack-auth.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.blob.vercel-storage.com https://*.vercel-storage.com https://ep-orange-fire-a85s6psf-pooler.eastus2.azure.neon.tech https://*.stack.inc https://*.stack-auth.com https://sessionize.com https://*.sessionize.com",
      "frame-src 'self' https://*.stack.inc https://*.stack-auth.com https://www.credly.com",
      // The CMS previews the live page in an iframe, so the page must be
      // framable — but only by us. This is the modern half of the pair with
      // X-Frame-Options below; both say the same thing for old and new agents.
      "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');

    this.headers['Content-Security-Policy'] = csp;
    return this;
  }

  /**
   * Clickjacking protection.
   *
   * SAMEORIGIN rather than DENY: the CMS preview frames the public page. That
   * is not a weakening of the clickjacking posture — a same-origin frame can
   * only be opened by our own pages, and the only page that does is behind
   * the admin allowlist. API responses keep DENY, since nothing should ever
   * frame those.
   */
  withFrameOptions(value: 'DENY' | 'SAMEORIGIN' = 'SAMEORIGIN'): this {
    this.headers['X-Frame-Options'] = value;
    return this;
  }

  // MIME type sniffing protection
  withContentTypeOptions(): this {
    this.headers['X-Content-Type-Options'] = 'nosniff';
    return this;
  }

  // Referrer policy
  withReferrerPolicy(): this {
    this.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    return this;
  }

  // Permissions policy
  withPermissionsPolicy(): this {
    this.headers['Permissions-Policy'] = [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()'
    ].join(', ');
    return this;
  }

  // HSTS (HTTPS only)
  withHSTS(): this {
    this.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    return this;
  }

  // XSS protection (legacy)
  withXSSProtection(): this {
    this.headers['X-XSS-Protection'] = '1; mode=block';
    return this;
  }

  // Build headers object
  build(): SecurityHeaders {
    return { ...this.headers };
  }

  // Apply headers to NextResponse
  apply(response: NextResponse): NextResponse {
    Object.entries(this.headers).forEach(([key, value]) => {
      if (value) {
        response.headers.set(key, value);
      }
    });
    return response;
  }
}

// Default security headers for API routes
export function addDefaultSecurityHeaders(response: NextResponse): NextResponse {
  return new SecurityHeadersBuilder()
    .withFrameOptions('DENY')
    .withContentTypeOptions()
    .withReferrerPolicy()
    .withPermissionsPolicy()
    .withXSSProtection()
    .apply(response);
}

// Full security headers for web pages
export function addFullSecurityHeaders(response: NextResponse): NextResponse {
  return new SecurityHeadersBuilder()
    .withCSP()
    .withFrameOptions()
    .withContentTypeOptions()
    .withReferrerPolicy()
    .withPermissionsPolicy()
    .withXSSProtection()
    .apply(response);
}

// CORS configuration
export interface CORSConfig {
  origins?: string[];
  methods?: string[];
  headers?: string[];
  credentials?: boolean;
}

export function addCORSHeaders(response: NextResponse, config: CORSConfig = {}): NextResponse {
  const {
    origins = ['http://localhost:3000', 'https://www.suzarilshah.uk'],
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers = ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials = true
  } = config;

  response.headers.set('Access-Control-Allow-Origin', origins.join(', '));
  response.headers.set('Access-Control-Allow-Methods', methods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', headers.join(', '));
  
  if (credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}
