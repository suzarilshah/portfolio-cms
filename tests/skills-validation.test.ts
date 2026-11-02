import { describe, expect, test } from 'vitest';
import { SecurityValidator } from '@/lib/security/validation';

const validate = (content: unknown) => SecurityValidator.validateSectionContent('skills', content);

describe('skills section validation', () => {
  test('keeps a well-formed category intact', () => {
    const result = validate({
      heading: 'Skills & Technologies',
      categories: [{ title: 'Cloud', icon: 'cloud', color: 'primary', skills: ['Azure', 'AWS'] }],
    });

    expect(result.isValid).toBe(true);
    expect(result.sanitized!.content.heading).toBe('Skills & Technologies');
    expect(result.sanitized!.content.categories).toEqual([
      { title: 'Cloud', icon: 'cloud', color: 'primary', skills: ['Azure', 'AWS'] },
    ]);
  });

  test('falls back to a known icon when the key is not in the renderer map', () => {
    const result = validate({ categories: [{ title: 'X', icon: 'rocket', color: 'primary', skills: [] }] });
    expect(result.sanitized!.content.categories[0].icon).toBe('cloud');
  });

  test('falls back to a known colour when the value is not in the renderer map', () => {
    const result = validate({ categories: [{ title: 'X', icon: 'cloud', color: 'hotpink', skills: [] }] });
    expect(result.sanitized!.content.categories[0].color).toBe('primary');
  });

  test('drops empty and non-string skills', () => {
    const result = validate({
      categories: [{ title: 'X', icon: 'cloud', color: 'primary', skills: ['Azure', '', '   ', 42, null] }],
    });
    expect(result.sanitized!.content.categories[0].skills).toEqual(['Azure']);
  });

  test('caps categories at 12', () => {
    const many = Array.from({ length: 30 }, (_, i) => ({
      title: `Category ${i}`,
      icon: 'cloud',
      color: 'primary',
      skills: [],
    }));
    expect(validate({ categories: many }).sanitized!.content.categories).toHaveLength(12);
  });

  test('caps skills per category at 20', () => {
    const skills = Array.from({ length: 50 }, (_, i) => `Skill ${i}`);
    const result = validate({ categories: [{ title: 'X', icon: 'cloud', color: 'primary', skills }] });
    expect(result.sanitized!.content.categories[0].skills).toHaveLength(20);
  });

  test('survives a category missing its skills array', () => {
    const result = validate({ categories: [{ title: 'X', icon: 'cloud', color: 'primary' }] });
    expect(result.sanitized!.content.categories[0].skills).toEqual([]);
  });

  test('strips markup from a category title', () => {
    const result = validate({
      categories: [{ title: '<script>alert(1)</script>Cloud', icon: 'cloud', color: 'primary', skills: [] }],
    });
    expect(result.sanitized!.content.categories[0].title).not.toContain('<script>');
  });

  test('strips markup from a skill entry', () => {
    const result = validate({
      categories: [{ title: 'X', icon: 'cloud', color: 'primary', skills: ['<img src=x onerror=alert(1)>'] }],
    });
    expect(result.sanitized!.content.categories[0].skills[0]).not.toContain('onerror=');
  });

  test('omits categories entirely when none are supplied, so the renderer keeps its defaults', () => {
    const result = validate({ heading: 'Just a heading' });
    expect(result.isValid).toBe(true);
    expect(result.sanitized!.content.categories).toBeUndefined();
  });
});
