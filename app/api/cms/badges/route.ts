import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { stackServerApp } from '@/stack';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM badges ORDER BY sort_order ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const current = await pool.query('SELECT * FROM badges WHERE id = $1', [id]);
    if (current.rowCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const { badge_id } = current.rows[0];

    let title = '';
    let image_url = '';
    let issuer = '';

    try {
      const res = await fetch(`https://www.credly.com/badges/${badge_id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)' }
      });
      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);
        const fullTitle = $('meta[property="og:title"]').attr('content') || '';
        image_url = $('meta[property="og:image"]').attr('content') || '';
        title = fullTitle.split(' was issued to')[0] || fullTitle;
      }
    } catch (e) {
      console.error('Failed to refetch Credly metadata:', e);
    }

    const updated = await pool.query(
      'UPDATE badges SET title = $1, image_url = $2, issuer = $3 WHERE id = $4 RETURNING *',
      [title, image_url, issuer, id]
    );
    return NextResponse.json(updated.rows[0]);
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
    const { badge_id, sort_order } = body;

    // Fetch Credly Metadata
    let title = '';
    let image_url = '';
    let issuer = '';

    try {
        console.log(`Fetching metadata for badge: ${badge_id}`);
        const res = await fetch(`https://www.credly.com/badges/${badge_id}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)'
            }
        });
        if (res.ok) {
            const html = await res.text();
            const $ = cheerio.load(html);
            
            // OpenGraph Tags
            const fullTitle = $('meta[property="og:title"]').attr('content') || '';
            image_url = $('meta[property="og:image"]').attr('content') || '';
            
            // Clean title: usually "Badge Name was issued to Name" or similar
            // We'll just use the full title for now or try to extract
            title = fullTitle.split(' was issued to')[0] || fullTitle;
            
            // Try to find issuer
            // Often in <a class="issuer-name"> or similar? 
            // We'll rely on title parsing or generic "Credly" if not found
        }
    } catch (e) {
        console.error('Failed to fetch Credly metadata:', e);
    }

    const result = await pool.query(
      `INSERT INTO badges (badge_id, sort_order, title, image_url, issuer) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [badge_id, sort_order || 0, title, image_url, issuer]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { badges } = body; // Array of { id, sort_order }

    if (!Array.isArray(badges)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const badge of badges) {
        await client.query(
          'UPDATE badges SET sort_order = $1 WHERE id = $2',
          [badge.sort_order, badge.id]
        );
      }
      
      await client.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    const user = await stackServerApp.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await pool.query('DELETE FROM badges WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
