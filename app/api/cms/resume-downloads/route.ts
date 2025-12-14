import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { createSecureAPIHandler } from '@/lib/security/middleware';

export const GET = createSecureAPIHandler(async () => {
  try {
    const result = await secureDb.query(
      'SELECT id, email, downloaded_at, created_at FROM resume_downloads ORDER BY downloaded_at DESC'
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAuth: true });
