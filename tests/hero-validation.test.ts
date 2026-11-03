import { describe, it, expect } from 'vitest';
import { SecurityValidator } from '@/lib/security/validation';

// validateSectionContent returns { isValid, errors, sanitized: { sectionKey, content } }.
// Unwrapping here keeps every assertion below about the content itself.
function hero(content: unknown) {
  const result = SecurityValidator.validateSectionContent('hero', content) as any;
  return {
    isValid: result.isValid,
    errors: result.errors as string[],
    sanitized: (result.sanitized?.content ?? {}) as any,
  };
}

describe('isSafeHttpUrl', () => {
  it('accepts absolute http and https', () => {
    expect(SecurityValidator.isSafeHttpUrl('https://mvp.microsoft.com/x')).toBe(true);
    expect(SecurityValidator.isSafeHttpUrl('http://example.com')).toBe(true);
  });

  // A blocklist would have to anticipate every scheme. These are the ones
  // that actually execute, but the point is that anything not http(s) fails.
  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'data:text/html;base64,PHNjcmlwdD4=',
    'vbscript:msgbox',
    'file:///etc/passwd',
    '#anchor',
    'not a url',
    '',
    null,
    undefined,
    42,
  ])('rejects %s', (value) => {
    expect(SecurityValidator.isSafeHttpUrl(value)).toBe(false);
  });
});

describe('hero credentials', () => {
  it('keeps label, issuer, since and a safe url', () => {
    const { sanitized } = hero({
      credentials: [
        { label: 'Microsoft MVP', issuer: 'AI & Azure', since: '2023', url: 'https://mvp.microsoft.com/p/1' },
      ],
    });
    // sanitizeHtml strips tags; it does not entity-encode, so an ampersand
    // in a legitimate issuer name survives as typed.
    expect(sanitized.credentials).toEqual([
      { label: 'Microsoft MVP', issuer: 'AI & Azure', since: '2023', url: 'https://mvp.microsoft.com/p/1' },
    ]);
  });

  // The credential survives; only the dangerous href is dropped. Failing the
  // whole save would be worse — it would lose the legitimate edit too.
  it('drops a javascript: url but keeps the credential', () => {
    const { sanitized } = hero({
      credentials: [{ label: 'Docker Captain', url: 'javascript:alert(1)' }],
    });
    expect(sanitized.credentials).toEqual([{ label: 'Docker Captain' }]);
  });

  it('discards entries with no label', () => {
    const { sanitized } = hero({ credentials: [{ issuer: 'Nobody' }, { label: 'Real' }] });
    expect(sanitized.credentials).toEqual([{ label: 'Real' }]);
  });

  // Four is what the hero lays out. More would silently not render, which is
  // the kind of mismatch that makes an editor feel broken.
  it('caps the list at four', () => {
    const { sanitized } = hero({
      credentials: Array.from({ length: 9 }, (_, i) => ({ label: `C${i}` })),
    });
    expect(sanitized.credentials).toHaveLength(4);
  });

  // The tags are stripped, which leaves nothing, which fails the label check
  // — so the entry is discarded rather than rendering as an empty chip.
  it('discards a credential whose label was entirely markup', () => {
    expect(hero({ credentials: [{ label: '<script>x</script>' }] }).sanitized.credentials).toEqual([]);
  });

  it('keeps the text around stripped markup', () => {
    expect(hero({ credentials: [{ label: 'MVP <b>2024</b>' }] }).sanitized.credentials).toEqual([
      { label: 'MVP 2024' },
    ]);
  });
});

describe('hero tagline and CTAs', () => {
  it('keeps a tagline', () => {
    expect(hero({ tagline: 'Azure at scale.' }).sanitized.tagline).toBe('Azure at scale.');
  });

  it('rejects an over-long tagline rather than truncating it', () => {
    const { isValid, errors } = hero({ tagline: 'x'.repeat(301) });
    expect(isValid).toBe(false);
    expect(errors.join()).toMatch(/Tagline/);
  });

  it('accepts a same-page anchor href', () => {
    expect(hero({ primary_cta: { label: 'Talk', href: '#contact' } }).sanitized.primary_cta).toEqual({
      label: 'Talk',
      href: '#contact',
    });
  });

  it('accepts an absolute external href', () => {
    expect(
      hero({ secondary_cta: { href: 'https://blog.suzarilshah.uk' } }).sanitized.secondary_cta
    ).toEqual({ href: 'https://blog.suzarilshah.uk' });
  });

  it('drops a javascript: href but keeps the label', () => {
    expect(hero({ primary_cta: { label: 'Click', href: 'javascript:alert(1)' } }).sanitized.primary_cta).toEqual(
      { label: 'Click' }
    );
  });

  it('drops a protocol-relative href, which could leave the origin', () => {
    expect(hero({ primary_cta: { label: 'Go', href: '//evil.example' } }).sanitized.primary_cta).toEqual({
      label: 'Go',
    });
  });

  it('omits the CTA entirely when nothing survives', () => {
    expect(hero({ primary_cta: { href: 'javascript:void 0' } }).sanitized.primary_cta).toBeUndefined();
  });
});
