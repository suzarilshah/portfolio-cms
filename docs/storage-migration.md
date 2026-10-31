# Portfolio storage migration

## Deployment

- Vercel team: **Yayasan Insan Prihatin** (`insanprihatin`).
- Project: **portfolio-cms**, ID `prj_ORICFeboGMMeRUdwbLSg927W77hQ`.
- Domains: `suzarilshah.uk` and `www.suzarilshah.uk`.
- Public Blob store: **portfolio-assets**, ID `store_puqAEVR0pNgZpCnv`, Singapore (`sin1`).
- The project transfer preserved the GitHub repository link, deployments, domain configuration, Neon connection, and Stack Auth configuration.

## Migrated assets

All 23 files supplied in `Exported/` were uploaded without altering their bytes. Public downloads were checked against their original sizes and SHA-256 checksums. Duplicate filenames were preserved as distinct objects. Stored CMS URLs, including historical project snapshots, were updated transactionally after verification.

User-confirmed mappings:

| Reference | Export filename |
| --- | --- |
| Profile photo | `a4e328d0-9f0d-4f3a-b503-71f104aee947 (1).JPG` |
| Favicon | `favicon.ico` |
| Social-preview image | `ShahWebs.png` |
| Prismo thumbnail, including historical versions | `Screenshot 2025-12-07 at 01.42.17.png` |
| Octo thumbnail | `Screenshot 2025-12-15 at 00.53.00.png` |

The separate documents-bucket résumé was not in the export. Its migration was deferred by the user, and the unavailable URL was cleared. Upload the original PDF/DOC/DOCX in **Admin → Settings → Resume** to restore downloads. Download buttons appear only when a document URL is configured.

## Upload flow

`/api/upload` authenticates Stack Auth users before issuing path-, type-, and size-restricted Blob client tokens. Settings files allow 15MB; project thumbnails allow 5MB. Browser uploads go directly to Blob, avoiding Vercel's function request-size limit. `/api/cms/projects/upload` verifies the uploaded object in this store and saves its thumbnail URL immediately. Read-write tokens never reach the browser.

## Migration tooling

Local state, exports, and database backups are ignored by Git:

- `.migration/assets.json`: filename, public URL, pathname, original size, and SHA-256 manifest.
- `.migration/reference-map.json`: legacy bucket/file IDs mapped to exported filenames; explicit `null` marks the deferred résumé.
- `.migration/database-before-rewrite-*.json`: original rows for rollback. Retain these locally until the migration has been accepted.

```sh
node scripts/migrate-storage.js inventory
node scripts/migrate-storage.js upload
node scripts/migrate-storage.js verify
node scripts/migrate-storage.js rewrite
node --test scripts/migrate-storage.test.js
node scripts/verify-deployment.js https://www.suzarilshah.uk
```

The script loads `.env.local`; override with `MIGRATION_ENV_FILE`. Override the source directory with `STORAGE_EXPORT_DIR`. Uploads use deterministic paths and refuse overwrites. Reference rewriting checks every text/JSON column in the public schema, aborts on unmapped URLs, and backs up affected rows before committing changes.

Only the export supplied by the user could be inventoried: Appwrite denied authenticated listing and downloads with HTTP 402. No claim is made that the export contains any additional files remaining in the inaccessible source buckets.
