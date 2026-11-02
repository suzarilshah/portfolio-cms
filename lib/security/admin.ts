// The site owner. Used when ADMIN_EMAILS is unset so a missing variable locks
// the CMS down to one known account rather than opening or bricking it.
export const OWNER_EMAIL = 'suzarilshah@gmail.com';

export function parseAdminEmails(raw: string | undefined): string[] {
  const entries = (raw ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return entries.length > 0 ? entries : [OWNER_EMAIL];
}

export function isAdminEmail(
  email: string | null | undefined,
  raw: string | undefined = process.env.ADMIN_EMAILS
): boolean {
  if (!email) return false;
  return parseAdminEmails(raw).includes(email.trim().toLowerCase());
}
