import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { createSecureAPIHandler } from '@/lib/security/middleware';
import { SecurityValidator } from '@/lib/security/validation';

/**
 * Normalise a list of `{ label, href }` links.
 *
 * Both the nav and the footer render these as anchors, so `href` is held to
 * the same rule as everywhere else: a same-page fragment, or an absolute
 * http(s) URL. A link that survives with no destination is dropped rather
 * than rendered as a dead one — the public site has carried two of those
 * ("Privacy Policy", "Terms of Service", both pointing at `#`).
 */
function sanitizeLinks(value: unknown, max: number): { label: string; href: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item: any) => {
      const label = item?.label ? String(item.label).trim().substring(0, 60) : '';
      const raw = typeof item?.href === 'string' ? item.href.trim() : '';
      const href =
        /^#[\w-]{1,60}$/.test(raw) || SecurityValidator.isSafeHttpUrl(raw)
          ? raw.substring(0, 300)
          : '';
      return { label, href };
    })
    .filter((link) => link.label && link.href)
    .slice(0, max);
}

export const GET = createSecureAPIHandler(async () => {
  try {
    const result = await secureDb.query('SELECT * FROM site_settings WHERE id = $1', [1]);
    return NextResponse.json(result[0] || {});
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
});

export const POST = createSecureAPIHandler(async (request: Request) => {
  try {
    const body = await request.json();

    // Validate and sanitize inputs
    const logo_text = body.logo_text ? String(body.logo_text).substring(0, 100) : '';
    const logo_highlight = body.logo_highlight ? String(body.logo_highlight).substring(0, 50) : '';
    const accent_color = body.accent_color ? String(body.accent_color).substring(0, 20) : '#0070f3';
    const logo_url = body.logo_url ? String(body.logo_url).substring(0, 500) : '';
    const profile_photo_url = body.profile_photo_url ? String(body.profile_photo_url).substring(0, 500) : '';
    const favicon_url = body.favicon_url ? String(body.favicon_url).substring(0, 500) : '';
    const resume_url = body.resume_url ? String(body.resume_url).substring(0, 500) : '';
    const seo_title = body.seo_title ? String(body.seo_title).substring(0, 200) : '';
    const seo_description = body.seo_description ? String(body.seo_description).substring(0, 500) : '';
    const seo_keywords = body.seo_keywords ? String(body.seo_keywords).substring(0, 300) : '';
    const seo_og_image = body.seo_og_image ? String(body.seo_og_image).substring(0, 500) : '';
    const background_pattern = body.background_pattern ? String(body.background_pattern).substring(0, 50) : 'dots';
    const background_svg_color = body.background_svg_color ? String(body.background_svg_color).substring(0, 20) : 'blue';
    const background_overlay_opacity = typeof body.background_overlay_opacity === 'number'
      ? Math.max(0, Math.min(80, body.background_overlay_opacity))
      : 30;
    const background_grid_intensity = typeof body.background_grid_intensity === 'number'
      ? Math.max(0, Math.min(100, Math.round(body.background_grid_intensity)))
      : 14;

    // Chrome that used to be hardcoded in components. Each is normalised here
    // rather than trusted: these values end up in hrefs on the public page.
    const nav_items = sanitizeLinks(body.nav_items, 8);
    const footer = {
      tagline: body.footer?.tagline ? String(body.footer.tagline).substring(0, 200) : '',
      note: body.footer?.note ? String(body.footer.note).substring(0, 200) : '',
      links: sanitizeLinks(body.footer?.links, 6),
    };
    const identity = {
      name: body.identity?.name ? String(body.identity.name).substring(0, 120) : '',
      job_title: body.identity?.job_title ? String(body.identity.job_title).substring(0, 120) : '',
      employer: body.identity?.employer ? String(body.identity.employer).substring(0, 120) : '',
      locality: body.identity?.locality ? String(body.identity.locality).substring(0, 120) : '',
      country: body.identity?.country ? String(body.identity.country).substring(0, 8) : '',
      same_as: Array.isArray(body.identity?.same_as)
        ? body.identity.same_as
            .filter((url: unknown) => SecurityValidator.isSafeHttpUrl(url))
            .map((url: string) => url.trim().substring(0, 300))
            .slice(0, 10)
        : [],
    };

    // Ensure expected columns exist (self-heal if migrations haven't run)
    try {
      await secureDb.query(`
        ALTER TABLE site_settings
        ADD COLUMN IF NOT EXISTS logo_url TEXT,
        ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
        ADD COLUMN IF NOT EXISTS favicon_url TEXT,
        ADD COLUMN IF NOT EXISTS resume_url TEXT,
        ADD COLUMN IF NOT EXISTS seo_title TEXT,
        ADD COLUMN IF NOT EXISTS seo_description TEXT,
        ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
        ADD COLUMN IF NOT EXISTS seo_og_image TEXT,
        ADD COLUMN IF NOT EXISTS background_pattern TEXT DEFAULT 'dots',
        ADD COLUMN IF NOT EXISTS background_svg_color TEXT DEFAULT 'blue',
        ADD COLUMN IF NOT EXISTS background_overlay_opacity INTEGER DEFAULT 30,
        ADD COLUMN IF NOT EXISTS background_grid_intensity INTEGER DEFAULT 14,
        ADD COLUMN IF NOT EXISTS nav_items JSONB,
        ADD COLUMN IF NOT EXISTS footer JSONB,
        ADD COLUMN IF NOT EXISTS identity JSONB;
      `);
    } catch (e) {
      // ignore
    }

    const result = await secureDb.query(
      `UPDATE site_settings
       SET logo_text = $1,
           logo_highlight = $2,
           accent_color = $3,
           logo_url = $4,
           profile_photo_url = $5,
           favicon_url = $6,
           resume_url = $7,
           seo_title = $8,
           seo_description = $9,
           seo_keywords = $10,
           seo_og_image = $11,
           background_pattern = $12,
           background_svg_color = $13,
           background_overlay_opacity = $14,
           background_grid_intensity = $15,
           nav_items = $16::jsonb,
           footer = $17::jsonb,
           identity = $18::jsonb,
           updated_at = NOW()
       WHERE id = $19 RETURNING *`,
      [
        logo_text, logo_highlight, accent_color, logo_url,
        profile_photo_url, favicon_url, resume_url,
        seo_title, seo_description, seo_keywords, seo_og_image,
        background_pattern, background_svg_color, background_overlay_opacity,
        background_grid_intensity,
        JSON.stringify(nav_items), JSON.stringify(footer), JSON.stringify(identity),
        1
      ]
    );

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAdmin: true, requireCSRF: true });
