# portfolio-cms

Personal portfolio site with a self-hosted CMS. The public page renders entirely
from Postgres; `/admin` is the editor that writes to it.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15, App Router, TypeScript |
| Database | Neon Postgres via `pg` |
| Auth | Stack Auth (`@stackframe/stack`), cookie token store |
| File storage | Vercel Blob, public store `portfolio-assets` (sin1) |
| Styling | Tailwind + custom design system, Framer Motion |
| Hosting | Vercel project `portfolio-cms`, team Yayasan Insan Prihatin → `suzarilshah.uk` |

## Commands

```sh
npm run dev         # dev server
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint (next/core-web-vitals)
npm test            # vitest, tests/**/*.test.ts
npm run test:scripts  # node:test suite for the storage migration script
```

CI (`.github/workflows/ci.yml`) runs all four checks on push to `main` and on
every PR.

## Architecture

### Public page

`app/page.tsx` is a server component with `force-dynamic` + `revalidate = 0`. It
reads `content_sections`, `badges` and `site_settings`, builds a
`section_key → React node` map, then renders `renderOrder.map(...)`.

**Section order and visibility are database-driven, not code-driven.** Adding a
section means adding both a row and an entry in the `SectionComponents` map.

Every read falls back to hardcoded defaults if `DATABASE_URL` is missing or the
query throws, so the site degrades instead of 500ing.

Components live in two directories, and the split is load-bearing for imports:

- `app/components/` — page sections (Hero, About, Experience, …)
- `components/` — reusable widgets (`ProjectsShowcase`, `SkillsMatrix`,
  `StructuredData`, backgrounds)

### Data access

Two clients against the same database, by design:

- `lib/db.ts` — plain global `pg.Pool`, used by server components
  (`app/page.tsx`, `app/layout.tsx`)
- `lib/security/database.ts` — `secureDb` singleton used by **all** API routes.
  `validateQuery` rejects a blocklist of dangerous patterns and requires
  placeholders on any query with a `WHERE`/`VALUES`/`SET` clause. Note it also
  rejects SQL comments (`--`, `/* */`), so don't put them in query strings.

### Content versioning

Section saves double-write to `content_history`; project saves double-write to
`project_history`. `app/api/cms/history` and `app/api/cms/projects/history`
serve and restore those revisions.

### Uploads

`lib/storage-policy.ts` is the single allowlist (path regex, content type, size
cap), imported by both the browser (`lib/upload-client.ts`) and the server
(`app/api/upload/route.ts`). The server authenticates the admin, then issues a
short-lived scoped Blob client token; bytes go browser → Blob directly, which
dodges the Vercel function body limit. The read-write token never reaches the
browser. Project thumbnails cap at 5MB, settings files at 15MB.

## Security model

Read this before touching anything under `lib/security/`.

- **`requireAdmin`, not `requireAuth`.** Every CMS write route passes
  `{ requireAdmin: true, requireCSRF: true }` to `createSecureAPIHandler`.
  `requireAdmin` implies `requireAuth` and additionally checks the user's email
  against `lib/security/admin.ts`. A signed-in Stack Auth account is *not*
  sufficient — being authenticated and being the owner are different questions.
  `app/admin/layout.tsx` gates the UI with the same `isAdminEmail` helper so the
  two cannot drift.
- **Allowlist config.** `ADMIN_EMAILS`, comma-separated. Unset falls back to
  `OWNER_EMAIL`, so a missing variable locks the CMS down rather than opening it.
- **CSRF** is `isSameOrigin` in `lib/security/csrf.ts`: exact `URL.host` match
  against the `host` header, origin falling back to referer. No header a browser
  lets a page set may bypass it.
- **Rate limiting** happens in exactly one place per request. The edge
  `middleware.ts` applies the global budget to every `/api/` path via
  `shouldRateLimit`; `SecurityMiddleware` only runs a limiter when a route sets
  an explicit `rateLimit` override. Checking both would burn two slots per
  request. Limiters are cached by config in `getRateLimiter` — constructing one
  per request resets its counters and the cap never trips.

Input validation is `lib/security/validation.ts` (`SecurityValidator`). Adding a
field to a section or project means adding it there too, or the write is
silently dropped from the sanitized payload.

## Conventions

- API routes are always wrapped in `createSecureAPIHandler`. Don't export a bare
  handler — it would skip rate limiting, CSRF and authorization.
- Tests go in `tests/` as `*.test.ts` (vitest). The `scripts/` suite uses
  `node:test` and has its own runner; `vitest.config.ts` scopes `include` to keep
  them apart.
- `<img>` over `next/image` is deliberate for Blob-hosted assets of unknown
  dimensions; those lint warnings are expected.

## Reference docs

- `DEPLOYMENT.md` — Vercel deploy and environment setup
- `SECURITY_GUIDE.md` — threat model notes
- `SEO_IMPLEMENTATION_GUIDE.md` — metadata, sitemap, structured data
- `docs/storage-migration.md` — the Appwrite → Vercel Blob migration and its tooling
