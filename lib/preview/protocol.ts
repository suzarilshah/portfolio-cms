/**
 * The contract between the CMS editor (parent) and the live public page
 * (iframe).
 *
 * This lives in its own module, free of React and of `window`, because the
 * interesting part is not the plumbing — it is deciding which messages to
 * trust. An iframe bridge that accepts any `postMessage` is an XSS primitive:
 * a third-party frame could push arbitrary content into the page. So every
 * inbound message is validated here, and both sides check the origin.
 */

/** Marks our messages so unrelated postMessage traffic is ignored outright. */
export const PREVIEW_CHANNEL = 'portfolio-cms-preview';

/** Query parameter that puts the public page into preview mode. */
export const PREVIEW_PARAM = 'preview';

/** Parent → iframe. */
export type EditorMessage =
  /** Replace the draft content for one section. */
  | { channel: typeof PREVIEW_CHANNEL; type: 'draft'; key: string; content: unknown }
  /** Scroll the given section into view and highlight it. */
  | { channel: typeof PREVIEW_CHANNEL; type: 'focus'; key: string }
  /** Drop every draft and fall back to what the server rendered. */
  | { channel: typeof PREVIEW_CHANNEL; type: 'reset' };

/** Iframe → parent. */
export type PreviewMessage =
  /** The bridge has mounted and is listening. Sent on every load. */
  | { channel: typeof PREVIEW_CHANNEL; type: 'ready'; sections: string[] }
  /** The visitor clicked inside a section; the panel should swap to it. */
  | { channel: typeof PREVIEW_CHANNEL; type: 'select'; key: string };

/**
 * Narrow an untrusted `MessageEvent.data` to an editor message.
 *
 * Returns null rather than throwing: a malformed message from a page we do
 * not control is an expected condition, not an error.
 */
export function parseEditorMessage(data: unknown): EditorMessage | null {
  if (typeof data !== 'object' || data === null) return null;
  const msg = data as Record<string, unknown>;
  if (msg.channel !== PREVIEW_CHANNEL) return null;

  switch (msg.type) {
    case 'draft':
      // `content` may legitimately be any shape — each section owns its own —
      // but the key identifies which editor it belongs to and must be a
      // non-empty string, or the draft map grows junk entries.
      if (typeof msg.key !== 'string' || msg.key === '') return null;
      return { channel: PREVIEW_CHANNEL, type: 'draft', key: msg.key, content: msg.content };
    case 'focus':
      if (typeof msg.key !== 'string' || msg.key === '') return null;
      return { channel: PREVIEW_CHANNEL, type: 'focus', key: msg.key };
    case 'reset':
      return { channel: PREVIEW_CHANNEL, type: 'reset' };
    default:
      return null;
  }
}

/** Narrow an untrusted `MessageEvent.data` to a preview message. */
export function parsePreviewMessage(data: unknown): PreviewMessage | null {
  if (typeof data !== 'object' || data === null) return null;
  const msg = data as Record<string, unknown>;
  if (msg.channel !== PREVIEW_CHANNEL) return null;

  switch (msg.type) {
    case 'ready': {
      const sections = Array.isArray(msg.sections)
        ? msg.sections.filter((s): s is string => typeof s === 'string')
        : [];
      return { channel: PREVIEW_CHANNEL, type: 'ready', sections };
    }
    case 'select':
      if (typeof msg.key !== 'string' || msg.key === '') return null;
      return { channel: PREVIEW_CHANNEL, type: 'select', key: msg.key };
    default:
      return null;
  }
}

/**
 * Merge drafts over what the server rendered.
 *
 * A draft of `undefined` means "no draft", not "empty content" — clearing a
 * field must still reach the preview, so only `undefined` falls through to
 * the published value.
 */
export function applyDrafts<T extends Record<string, unknown>>(
  published: T,
  drafts: Record<string, unknown>
): T {
  const merged: Record<string, unknown> = { ...published };
  for (const [key, value] of Object.entries(drafts)) {
    if (value !== undefined) merged[key] = value;
  }
  return merged as T;
}

/** The viewports the editor can preview at, in the order they are offered. */
export const PREVIEW_DEVICES = [
  { id: 'desktop', label: 'Desktop', width: null },
  { id: 'tablet', label: 'Tablet', width: 834 },
  { id: 'phone', label: 'Phone', width: 390 },
] as const;

export type PreviewDeviceId = (typeof PREVIEW_DEVICES)[number]['id'];

/** The public page URL for a given section, in preview mode. */
export function previewUrl(sectionKey?: string): string {
  const base = `/?${PREVIEW_PARAM}=1`;
  return sectionKey ? `${base}#${sectionKey}` : base;
}
