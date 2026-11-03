import { describe, it, expect } from 'vitest';
import { SecurityValidator } from '@/lib/security/validation';

/**
 * The nav and footer link rule, mirrored from app/api/cms/settings/route.ts.
 *
 * It is duplicated here rather than exported because the route is a module
 * with side effects (it builds a secure handler at import time) and pulling
 * it into a test would drag the database client in with it. The rule is four
 * lines; the risk of drift is smaller than the risk of an untested href
 * allowlist.
 */
function linkHref(raw: unknown): string {
  const value = typeof raw === 'string' ? raw.trim() : '';
  return /^#[\w-]{1,60}$/.test(value) || SecurityValidator.isSafeHttpUrl(value)
    ? value.substring(0, 300)
    : '';
}

describe('nav and footer hrefs', () => {
  it('accepts same-page fragments', () => {
    expect(linkHref('#projects')).toBe('#projects');
    expect(linkHref('#about-me')).toBe('#about-me');
  });

  it('accepts absolute external links', () => {
    expect(linkHref('https://blog.suzarilshah.uk')).toBe('https://blog.suzarilshah.uk');
  });

  it.each([
    ['a bare hash, which scrolls nowhere', '#'],
    ['a relative path, which is not a section', '/about'],
    ['a protocol-relative URL', '//evil.example'],
    ['javascript:', 'javascript:alert(1)'],
    ['data:', 'data:text/html,<script>x</script>'],
    ['an empty string', ''],
    ['a number', 42],
  ])('rejects %s', (_label, value) => {
    expect(linkHref(value)).toBe('');
  });

  // The two dead footer links on the live site were both exactly "#".
  it('would have dropped the dead Privacy Policy link', () => {
    expect(linkHref('#')).toBe('');
  });
});
