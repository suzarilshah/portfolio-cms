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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sgp.cloud.appwrite.io https://cdn.credly.com https://*.stack.inc https://*.stack-auth.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.stack.inc https://*.stack-auth.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://sgp.cloud.appwrite.io https://ep-orange-fire-a85s6psf-pooler.eastus2.azure.neon.tech https://*.stack.inc https://*.stack-auth.com https://sessionize.com https://*.sessionize.com",
      "frame-src 'self' https://*.stack.inc https://*.stack-auth.com https://www.credly.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');

    this.headers['Content-Security-Policy'] = csp;
    return this;
  }

  // Clickjacking protection
  withFrameOptions(): this {
    this.headers['X-Frame-Options'] = 'DENY';
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
    .withFrameOptions()
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
