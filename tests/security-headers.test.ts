import { describe, it, expect } from 'vitest';
import { SecurityHeadersBuilder } from '@/lib/security/headers';

/**
 * The CMS preview depends on the public page being framable, and the security
 * posture depends on it being framable by *nobody else*. Those two pull in
 * opposite directions, so the exact values are pinned here.
 */
describe('frame policy', () => {
  it('allows same-origin framing by default', () => {
    expect(new SecurityHeadersBuilder().withFrameOptions().build()['X-Frame-Options']).toBe(
      'SAMEORIGIN'
    );
  });

  it('still allows DENY where nothing should frame the response', () => {
    expect(new SecurityHeadersBuilder().withFrameOptions('DENY').build()['X-Frame-Options']).toBe(
      'DENY'
    );
  });

  it('restricts frame-ancestors to self, not to nothing and not to anyone', () => {
    const csp = new SecurityHeadersBuilder().withCSP().build()['Content-Security-Policy'] ?? '';
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).not.toContain('frame-ancestors *');
  });

  it('keeps the rest of the policy locked down', () => {
    const csp = new SecurityHeadersBuilder().withCSP().build()['Content-Security-Policy'] ?? '';
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
  });
});
