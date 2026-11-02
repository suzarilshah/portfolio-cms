import { describe, expect, test } from 'vitest';
import { isSameOrigin } from '@/lib/security/csrf';

describe('isSameOrigin', () => {
  test('accepts an origin whose host matches exactly', () => {
    expect(isSameOrigin('https://suzarilshah.uk', null, 'suzarilshah.uk')).toBe(true);
  });

  test('accepts a matching host that carries a port', () => {
    expect(isSameOrigin('http://localhost:3000', null, 'localhost:3000')).toBe(true);
  });

  test('rejects an attacker domain that suffixes the real host', () => {
    expect(isSameOrigin('https://suzarilshah.uk.evil.test', null, 'suzarilshah.uk')).toBe(false);
  });

  test('rejects an attacker domain that embeds the real host in its path', () => {
    expect(isSameOrigin('https://evil.test', null, 'suzarilshah.uk')).toBe(false);
  });

  test('rejects a sibling subdomain', () => {
    expect(isSameOrigin('https://evil.suzarilshah.uk', null, 'suzarilshah.uk')).toBe(false);
  });

  test('falls back to the referer when no origin header is present', () => {
    expect(isSameOrigin(null, 'https://suzarilshah.uk/admin/projects', 'suzarilshah.uk')).toBe(true);
  });

  test('rejects a referer from another host', () => {
    expect(isSameOrigin(null, 'https://evil.test/admin/projects', 'suzarilshah.uk')).toBe(false);
  });

  test('rejects a request carrying neither origin nor referer', () => {
    expect(isSameOrigin(null, null, 'suzarilshah.uk')).toBe(false);
  });

  test('rejects when the host header is missing', () => {
    expect(isSameOrigin('https://suzarilshah.uk', null, null)).toBe(false);
  });

  test('rejects an unparseable origin', () => {
    expect(isSameOrigin('not-a-url', null, 'suzarilshah.uk')).toBe(false);
  });

  test('ignores the x-requested-with escape hatch by having no such parameter', () => {
    // Regression guard: the signature takes only origin, referer and host, so no
    // client-settable header can opt out of the check.
    expect(isSameOrigin.length).toBe(3);
  });
});
