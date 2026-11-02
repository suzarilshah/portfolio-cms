import { describe, it, expect } from 'vitest';
import {
  PREVIEW_CHANNEL,
  applyDrafts,
  parseEditorMessage,
  parsePreviewMessage,
  previewUrl,
} from '@/lib/preview/protocol';

describe('parseEditorMessage', () => {
  it('accepts a well-formed draft', () => {
    expect(
      parseEditorMessage({
        channel: PREVIEW_CHANNEL,
        type: 'draft',
        key: 'hero',
        content: { headline: 'Hi' },
      })
    ).toEqual({
      channel: PREVIEW_CHANNEL,
      type: 'draft',
      key: 'hero',
      content: { headline: 'Hi' },
    });
  });

  it('accepts focus and reset', () => {
    expect(parseEditorMessage({ channel: PREVIEW_CHANNEL, type: 'focus', key: 'about' })).toEqual({
      channel: PREVIEW_CHANNEL,
      type: 'focus',
      key: 'about',
    });
    expect(parseEditorMessage({ channel: PREVIEW_CHANNEL, type: 'reset' })).toEqual({
      channel: PREVIEW_CHANNEL,
      type: 'reset',
    });
  });

  // The bridge listens on a shared bus. Anything not explicitly ours is
  // somebody else's traffic, or an attempt to inject content.
  it.each([
    ['a message with no channel', { type: 'draft', key: 'hero', content: {} }],
    ['a foreign channel', { channel: 'other', type: 'draft', key: 'hero', content: {} }],
    ['an unknown type', { channel: PREVIEW_CHANNEL, type: 'exec', key: 'hero' }],
    ['a draft with no key', { channel: PREVIEW_CHANNEL, type: 'draft', content: {} }],
    ['a draft with an empty key', { channel: PREVIEW_CHANNEL, type: 'draft', key: '', content: {} }],
    ['a non-string key', { channel: PREVIEW_CHANNEL, type: 'draft', key: 7, content: {} }],
    ['a string payload', 'draft'],
    ['null', null],
  ])('rejects %s', (_label, payload) => {
    expect(parseEditorMessage(payload)).toBeNull();
  });
});

describe('parsePreviewMessage', () => {
  it('accepts ready with a section list', () => {
    expect(
      parsePreviewMessage({ channel: PREVIEW_CHANNEL, type: 'ready', sections: ['hero', 'about'] })
    ).toEqual({ channel: PREVIEW_CHANNEL, type: 'ready', sections: ['hero', 'about'] });
  });

  it('drops non-string entries from the section list rather than failing', () => {
    expect(
      parsePreviewMessage({ channel: PREVIEW_CHANNEL, type: 'ready', sections: ['hero', 3, null] })
    ).toEqual({ channel: PREVIEW_CHANNEL, type: 'ready', sections: ['hero'] });
  });

  it('tolerates ready with no section list', () => {
    expect(parsePreviewMessage({ channel: PREVIEW_CHANNEL, type: 'ready' })).toEqual({
      channel: PREVIEW_CHANNEL,
      type: 'ready',
      sections: [],
    });
  });

  it('accepts select', () => {
    expect(parsePreviewMessage({ channel: PREVIEW_CHANNEL, type: 'select', key: 'skills' })).toEqual(
      { channel: PREVIEW_CHANNEL, type: 'select', key: 'skills' }
    );
  });

  it('rejects a foreign channel', () => {
    expect(parsePreviewMessage({ channel: 'x', type: 'select', key: 'skills' })).toBeNull();
  });
});

describe('applyDrafts', () => {
  it('overrides only the keys that have drafts', () => {
    const published = { hero: { a: 1 }, about: { b: 2 } };
    expect(applyDrafts(published, { hero: { a: 9 } })).toEqual({
      hero: { a: 9 },
      about: { b: 2 },
    });
  });

  // Clearing every field is a real edit. If an empty object fell back to the
  // published content, the preview would lie about what Publish will do.
  it('lets a draft clear content', () => {
    expect(applyDrafts({ hero: { a: 1 } }, { hero: {} })).toEqual({ hero: {} });
    expect(applyDrafts({ hero: { a: 1 } }, { hero: null })).toEqual({ hero: null });
  });

  it('treats undefined as "no draft"', () => {
    expect(applyDrafts({ hero: { a: 1 } }, { hero: undefined })).toEqual({ hero: { a: 1 } });
  });

  it('does not mutate the published object', () => {
    const published = { hero: { a: 1 } };
    applyDrafts(published, { hero: { a: 2 } });
    expect(published).toEqual({ hero: { a: 1 } });
  });

  it('adds sections that the server did not render', () => {
    expect(applyDrafts({} as Record<string, unknown>, { hero: { a: 1 } })).toEqual({
      hero: { a: 1 },
    });
  });
});

describe('previewUrl', () => {
  it('targets the public page in preview mode', () => {
    expect(previewUrl()).toBe('/?preview=1');
  });

  it('anchors to a section when given one', () => {
    expect(previewUrl('contact')).toBe('/?preview=1#contact');
  });
});
