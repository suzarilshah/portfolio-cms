// Compares the request's declared origin against the host it reached.
//
// The host header is the authority Next.js served, so an exact match on
// URL.host (which includes the port) is the whole test. Substring matching
// would accept `https://suzarilshah.uk.evil.test`, and any header a browser
// lets a page set — `x-requested-with`, for one — cannot be an escape hatch.
export function isSameOrigin(
  origin: string | null,
  referer: string | null,
  host: string | null
): boolean {
  if (!host) return false;

  const declared = origin ?? referer;
  if (!declared) return false;

  try {
    return new URL(declared).host === host;
  } catch {
    return false;
  }
}
