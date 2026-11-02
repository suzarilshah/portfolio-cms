import { describe, expect, test } from 'vitest';
import { InMemoryRateLimiter, getRateLimiter, shouldRateLimit } from '@/lib/security/rate-limiter';

describe('shouldRateLimit', () => {
  test('covers CMS routes, which were previously exempt', () => {
    expect(shouldRateLimit('/api/cms/sections')).toBe(true);
    expect(shouldRateLimit('/api/cms/projects')).toBe(true);
  });

  test('covers the other API routes', () => {
    expect(shouldRateLimit('/api/upload')).toBe(true);
    expect(shouldRateLimit('/api/resume/download')).toBe(true);
  });

  test('leaves the Stack Auth handler alone so sign-in is never throttled', () => {
    expect(shouldRateLimit('/api/auth/callback')).toBe(false);
  });

  test('leaves page routes alone', () => {
    expect(shouldRateLimit('/')).toBe(false);
    expect(shouldRateLimit('/admin/projects')).toBe(false);
  });
});

describe('getRateLimiter', () => {
  test('returns the same instance for an identical configuration', () => {
    const first = getRateLimiter(60000, 20);
    const second = getRateLimiter(60000, 20);
    expect(second).toBe(first);
  });

  test('returns distinct instances for different configurations', () => {
    expect(getRateLimiter(60000, 20)).not.toBe(getRateLimiter(60000, 21));
    expect(getRateLimiter(60000, 20)).not.toBe(getRateLimiter(30000, 20));
  });

  test('accumulates counts across lookups so the limit actually trips', () => {
    // The bug being fixed: a fresh limiter per request never reaches its cap.
    for (let i = 0; i < 3; i++) {
      expect(getRateLimiter(60000, 3).check('counted-client').allowed).toBe(true);
    }
    expect(getRateLimiter(60000, 3).check('counted-client').allowed).toBe(false);
  });
});

describe('InMemoryRateLimiter', () => {
  test('allows requests up to the configured maximum', () => {
    const limiter = new InMemoryRateLimiter(60000, 3);
    expect(limiter.check('client').allowed).toBe(true);
    expect(limiter.check('client').allowed).toBe(true);
    expect(limiter.check('client').allowed).toBe(true);
  });

  test('blocks the request after the maximum is reached', () => {
    const limiter = new InMemoryRateLimiter(60000, 2);
    limiter.check('client');
    limiter.check('client');
    expect(limiter.check('client').allowed).toBe(false);
  });

  test('tracks each identifier independently', () => {
    const limiter = new InMemoryRateLimiter(60000, 1);
    limiter.check('client-a');
    expect(limiter.check('client-b').allowed).toBe(true);
  });

  test('reports the remaining budget as it is consumed', () => {
    const limiter = new InMemoryRateLimiter(60000, 3);
    expect(limiter.check('client').remaining).toBe(2);
    expect(limiter.check('client').remaining).toBe(1);
    expect(limiter.check('client').remaining).toBe(0);
  });
});
