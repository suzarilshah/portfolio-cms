import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { createSecureAPIHandler } from '@/lib/security/middleware';

// Validate section key is allowed
function validateSectionKey(key: string): boolean {
  const allowedKeys = ['hero', 'about', 'experience', 'projects', 'skills', 'awards', 'community', 'contact'];
  return allowedKeys.includes(key);
}

export const GET = createSecureAPIHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const id = searchParams.get('id');

  try {
    if (id) {
      // Validate ID is a number
      const idNum = parseInt(String(id));
      if (isNaN(idNum) || idNum <= 0) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
      }

      // Fetch specific version content
      const result = await secureDb.query('SELECT * FROM content_history WHERE id = $1', [idNum]);
      if (result.length === 0) {
        return NextResponse.json({ error: 'Version not found' }, { status: 404 });
      }
      return NextResponse.json(result[0]);
    } else if (key) {
      // Validate section key is allowed
      if (!validateSectionKey(key)) {
        return NextResponse.json({ error: 'Invalid section key' }, { status: 400 });
      }

      // Fetch list of versions (metadata only)
      const result = await secureDb.query(
        'SELECT id, created_at FROM content_history WHERE section_key = $1 ORDER BY created_at DESC LIMIT 20',
        [key]
      );
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Key or ID required' }, { status: 400 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
});
