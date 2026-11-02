/**
 * The map between a `content_sections` row and the screen that edits it.
 *
 * `app/page.tsx` decides what the public page renders; this decides what the
 * CMS can edit. Keeping the registry in one place means a key present in one
 * and missing from the other is something the UI can *show* you, rather than a
 * silent dead end — which is exactly how /admin/blog came to edit a section
 * nothing rendered.
 */

export interface SectionEditorEntry {
  label: string;
  href: string;
  /** One line, shown under the title on the editor screen and in search. */
  blurb: string;
}

export const SECTION_EDITORS: Record<string, SectionEditorEntry> = {
  hero: { label: 'Hero', href: '/admin/hero', blurb: 'Headline, typing phrases and intro.' },
  about: { label: 'About', href: '/admin/about', blurb: 'Bio, interests and the pull quote.' },
  skills: { label: 'Skills', href: '/admin/skills', blurb: 'Capability matrix by category.' },
  projects: { label: 'Projects', href: '/admin/projects', blurb: 'Case studies and thumbnails.' },
  experience: { label: 'Experience', href: '/admin/experience', blurb: 'Roles and project management history.' },
  education: { label: 'Education', href: '/admin/education', blurb: 'Degrees and research.' },
  awards: { label: 'Awards', href: '/admin/awards', blurb: 'Recognition and certifications.' },
  publications: { label: 'Publications', href: '/admin/publications', blurb: 'Papers and technical articles.' },
  community: { label: 'Community', href: '/admin/community', blurb: 'Talks and volunteering.' },
  contact: { label: 'Contact', href: '/admin/contact', blurb: 'Booking and contact details.' },
};

/** Section keys `app/page.tsx` can actually render. Keep in sync with SectionComponents. */
export const RENDERABLE_SECTIONS = Object.keys(SECTION_EDITORS);

export interface SectionRow {
  section_key: string;
  sort_order: number;
  is_visible: boolean | null;
  updated_at: string | Date | null;
}

export type SectionIssue = 'no-editor' | 'not-rendered';

export function issueFor(key: string): SectionIssue | null {
  if (!SECTION_EDITORS[key]) return 'no-editor';
  if (!RENDERABLE_SECTIONS.includes(key)) return 'not-rendered';
  return null;
}

export function relativeTime(value: string | Date | null | undefined): string {
  if (!value) return 'never';
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return 'never';

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return 'just now';

  const units: [number, string][] = [
    [60, 'm'],
    [3600, 'h'],
    [86400, 'd'],
    [2592000, 'mo'],
    [31536000, 'y'],
  ];

  let unit = 'm';
  let amount = Math.round(seconds / 60);
  for (let i = units.length - 1; i >= 0; i--) {
    if (seconds >= units[i][0]) {
      amount = Math.floor(seconds / units[i][0]);
      unit = units[i][1];
      break;
    }
  }
  return `${amount}${unit} ago`;
}
