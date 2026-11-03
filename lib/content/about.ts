/**
 * Closed sets the About section validates against and renders from.
 *
 * This is a plain module, not an export from the component, because the
 * validator runs inside API routes: importing it from AboutSection.tsx would
 * pull framer-motion and lucide into the server bundle for the sake of one
 * string array.
 *
 * The rule it enforces is the one in CLAUDE.md — a closed set is validated
 * against the same list the renderer looks up, so a value can never be saved
 * that the page cannot draw.
 */

export const ABOUT_INTEREST_ICONS = [
  'gaming',
  'tv',
  'music',
  'coffee',
  'reading',
  'travel',
  'photography',
  'fitness',
  'sparkle',
] as const;

export type AboutInterestIcon = (typeof ABOUT_INTEREST_ICONS)[number];

/** What an unknown or missing icon name falls back to. */
export const DEFAULT_INTEREST_ICON: AboutInterestIcon = 'sparkle';
