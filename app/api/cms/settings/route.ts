import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { stackServerApp } from '@/stack';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    return NextResponse.json(result.rows[0] || {});
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { 
      logo_text, logo_highlight, accent_color, logo_url, 
      profile_photo_url, favicon_url, resume_url,
      seo_title, seo_description, seo_keywords, seo_og_image,
      background_pattern
    } = body;

    // Ensure expected columns exist (self-heal if migrations haven't run)
    try {
      await pool.query(`
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

    const result = await pool.query(
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
       WHERE id = 1 RETURNING *`,
      [
        logo_text, logo_highlight, accent_color, logo_url, 
        profile_photo_url, favicon_url, resume_url,
        seo_title, seo_description, seo_keywords, seo_og_image,
        background_pattern
      ]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
