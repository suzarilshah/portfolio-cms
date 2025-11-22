import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { stackServerApp } from '@/stack';
import { SecurityValidator } from '@/lib/security/validation';
import { createSecureAPIHandler } from '@/lib/security/middleware';

export const GET = createSecureAPIHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  // Validate section key parameter
  if (key && !/^[a-zA-Z0-9_-]+$/.test(key)) {
    return NextResponse.json({ error: 'Invalid section key' }, { status: 400 });
  }

  try {
    if (key) {
        const result = await secureDb.query('SELECT * FROM content_sections WHERE section_key = $1', [key]);
        return NextResponse.json(result[0] || {});
    } else {
        const result = await secureDb.query('SELECT * FROM content_sections');
        return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
});

export const POST = createSecureAPIHandler(async (request: Request) => {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { section_key, content } = body;

    // Validate and sanitize input
    const validation = SecurityValidator.validateSectionContent(section_key, content);
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }
    
    const sanitized = validation.sanitized!;

    const result = await secureDb.query(
      `INSERT INTO content_sections (section_key, content) 
       VALUES ($1, $2) 
       ON CONFLICT (section_key) 
       DO UPDATE SET content = $2, updated_at = NOW() 
       RETURNING *`,
      [sanitized.sectionKey, JSON.stringify(sanitized.content)]
    );

    // Save to History
    await secureDb.query(
        `INSERT INTO content_history (section_key, content) VALUES ($1, $2)`,
        [sanitized.sectionKey, JSON.stringify(sanitized.content)]
    );

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAuth: true });
