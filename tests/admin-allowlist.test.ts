import { describe, expect, test } from 'vitest';
import { OWNER_EMAIL, isAdminEmail, parseAdminEmails } from '@/lib/security/admin';

describe('parseAdminEmails', () => {
  test('falls back to the owner email when the variable is unset', () => {
    expect(parseAdminEmails(undefined)).toEqual([OWNER_EMAIL]);
  });

  test('falls back to the owner email when the variable is blank', () => {
    expect(parseAdminEmails('   ')).toEqual([OWNER_EMAIL]);
  });

  test('splits a comma-separated list, trimming and lowercasing each entry', () => {
    expect(parseAdminEmails(' First@Example.com , second@example.com ')).toEqual([
      'first@example.com',
      'second@example.com',
    ]);
  });

  test('drops empty entries left by trailing or doubled commas', () => {
    expect(parseAdminEmails('a@example.com,,b@example.com,')).toEqual([
      'a@example.com',
      'b@example.com',
    ]);
  });
});

describe('isAdminEmail', () => {
  const allowlist = 'owner@example.com,second@example.com';

  test('accepts an address on the allowlist', () => {
    expect(isAdminEmail('owner@example.com', allowlist)).toBe(true);
  });

  test('accepts regardless of case', () => {
    expect(isAdminEmail('Owner@Example.COM', allowlist)).toBe(true);
  });

  test('rejects an address that is not on the allowlist', () => {
    expect(isAdminEmail('attacker@example.com', allowlist)).toBe(false);
  });

  test('rejects an address that merely contains an allowlisted one', () => {
    expect(isAdminEmail('owner@example.com.evil.test', allowlist)).toBe(false);
  });

  test('rejects a null email', () => {
    expect(isAdminEmail(null, allowlist)).toBe(false);
  });

  test('rejects an undefined email', () => {
    expect(isAdminEmail(undefined, allowlist)).toBe(false);
  });

  test('rejects an empty email', () => {
    expect(isAdminEmail('', allowlist)).toBe(false);
  });
});
