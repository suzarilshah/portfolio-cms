import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const id = searchParams.get('id');

  try {
    if (id) {
        // Fetch specific version content
        const result = await pool.query('SELECT * FROM content_history WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Version not found' }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } else if (key) {
        // Fetch list of versions (metadata only)
        const result = await pool.query(
            'SELECT id, created_at FROM content_history WHERE section_key = $1 ORDER BY created_at DESC LIMIT 20',
            [key]
        );
        return NextResponse.json(result.rows);
    }
    
    return NextResponse.json({ error: 'Key or ID required' }, { status: 400 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
