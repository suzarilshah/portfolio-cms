import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { createSecureAPIHandler } from '@/lib/security/middleware';

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
        ADD COLUMN IF NOT EXISTS background_pattern TEXT DEFAULT 'dots';
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
           updated_at = NOW()
       WHERE id = $13 RETURNING *`,
      [
        logo_text, logo_highlight, accent_color, logo_url,
        profile_photo_url, favicon_url, resume_url,
        seo_title, seo_description, seo_keywords, seo_og_image,
        background_pattern, 1
      ]
    );

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAuth: true });
