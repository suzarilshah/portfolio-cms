import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { createSecureAPIHandler } from '@/lib/security/middleware';

export const GET = createSecureAPIHandler(async () => {
  try {
    const result = await secureDb.query('SELECT section_key, sort_order, is_visible FROM content_sections ORDER BY sort_order ASC');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
});

export const POST = createSecureAPIHandler(async (request: Request) => {
  try {
    const body = await request.json();
    const { sections } = body; // Array of { section_key, sort_order, is_visible }

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    // Validate each section entry
    const allowedSectionKeys = ['hero', 'about', 'experience', 'projects', 'projects-showcase', 'skills', 'awards', 'community', 'contact'];
    for (const section of sections) {
      if (!section.section_key || section.sort_order === undefined || section.is_visible === undefined) {
        return NextResponse.json({ error: 'Each section requires section_key, sort_order, and is_visible' }, { status: 400 });
      }

      // Validate section_key is allowed
      if (!allowedSectionKeys.includes(section.section_key)) {
        return NextResponse.json({ error: `Invalid section_key: ${section.section_key}` }, { status: 400 });
      }

      // Validate sort_order is a number
      const sortOrderNum = parseInt(String(section.sort_order));
      if (isNaN(sortOrderNum) || sortOrderNum < 0) {
        return NextResponse.json({ error: 'Invalid sort_order' }, { status: 400 });
      }

      // Validate is_visible is boolean
      if (typeof section.is_visible !== 'boolean') {
        return NextResponse.json({ error: 'is_visible must be a boolean' }, { status: 400 });
      }
    }

    // Perform updates atomically with secureDb
    const updatePromises = sections.map(section => {
      const sortOrderNum = parseInt(String(section.sort_order));
      return secureDb.query(
        `UPDATE content_sections
         SET sort_order = $1, is_visible = $2, updated_at = NOW()
         WHERE section_key = $3`,
        [sortOrderNum, section.is_visible, section.section_key]
      );
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAuth: true });
