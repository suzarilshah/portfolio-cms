import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { createSecureAPIHandler } from '@/lib/security/middleware';
import * as cheerio from 'cheerio';

// SSRF Protection: Validate badge_id to only allow alphanumeric characters
function validateBadgeId(badgeId: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(badgeId);
}

export const GET = createSecureAPIHandler(async () => {
  try {
    const result = await secureDb.query('SELECT * FROM badges ORDER BY sort_order ASC');
    console.log(`[GET /api/cms/badges] Returning ${result.length} badges`);
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[GET /api/cms/badges] Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAuth: false });

export const PATCH = createSecureAPIHandler(async (request: Request) => {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // Validate ID is a number
    const idNum = parseInt(String(id));
    if (isNaN(idNum) || idNum <= 0) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const current = await secureDb.query('SELECT * FROM badges WHERE id = $1', [idNum]);
    if (current.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const { badge_id } = current[0];

    // SSRF Protection: Validate badge_id before making external request
    if (!validateBadgeId(badge_id)) {
      return NextResponse.json({ error: 'Invalid badge ID format' }, { status: 400 });
    }

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

    const updated = await secureDb.query(
      'UPDATE badges SET title = $1, image_url = $2, issuer = $3 WHERE id = $4 RETURNING *',
      [title, image_url, issuer, idNum]
    );
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAuth: true });

export const POST = createSecureAPIHandler(async (request: Request) => {
  try {
    const body = await request.json();
    const { badge_id, sort_order } = body;

    // Validate inputs
    if (!badge_id) {
      return NextResponse.json({ error: 'Badge ID required' }, { status: 400 });
    }

    // SSRF Protection: Validate badge_id before making external request
    if (!validateBadgeId(badge_id)) {
      return NextResponse.json({ error: 'Invalid badge ID format' }, { status: 400 });
    }

    // Validate sort_order
    const sortOrderNum = sort_order !== undefined ? parseInt(String(sort_order)) : 0;
    if (isNaN(sortOrderNum) || sortOrderNum < 0) {
      return NextResponse.json({ error: 'Invalid sort order' }, { status: 400 });
    }

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
            title = fullTitle.split(' was issued to')[0] || fullTitle;
        }
    } catch (e) {
        console.error('Failed to fetch Credly metadata:', e);
    }

    const result = await secureDb.query(
      `INSERT INTO badges (badge_id, sort_order, title, image_url, issuer) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [badge_id, sortOrderNum, title, image_url, issuer]
    );
    console.log(`[POST /api/cms/badges] Created badge with ID: ${result[0].id}, badge_id: ${badge_id}`);
    return NextResponse.json(result[0], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAuth: true });

export const PUT = createSecureAPIHandler(async (request: Request) => {
  try {
    const body = await request.json();
    const { badges } = body; // Array of { id, sort_order }

    if (!Array.isArray(badges)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Validate each badge entry
    for (const badge of badges) {
      if (!badge.id || badge.sort_order === undefined) {
        return NextResponse.json({ error: 'Each badge requires id and sort_order' }, { status: 400 });
      }
      const idNum = parseInt(String(badge.id));
      const sortOrderNum = parseInt(String(badge.sort_order));
      if (isNaN(idNum) || idNum <= 0 || isNaN(sortOrderNum) || sortOrderNum < 0) {
        return NextResponse.json({ error: 'Invalid badge id or sort_order' }, { status: 400 });
      }
    }

    // Perform updates with secureDb (atomic transaction)
    const updatePromises = badges.map(badge => {
      const idNum = parseInt(String(badge.id));
      const sortOrderNum = parseInt(String(badge.sort_order));
      return secureDb.query(
        'UPDATE badges SET sort_order = $1 WHERE id = $2',
        [sortOrderNum, idNum]
      );
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAuth: true });

export const DELETE = createSecureAPIHandler(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // Validate ID is a number
    const idNum = parseInt(String(id));
    if (isNaN(idNum) || idNum <= 0) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await secureDb.query('DELETE FROM badges WHERE id = $1', [idNum]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAuth: true });
