import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { stackServerApp } from '@/stack';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  try {
    if (key) {
        const result = await pool.query('SELECT * FROM content_sections WHERE section_key = $1', [key]);
        return NextResponse.json(result.rows[0] || {});
    } else {
        const result = await pool.query('SELECT * FROM content_sections');
        return NextResponse.json(result.rows);
    }
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
    const { section_key, content } = body;

    const result = await pool.query(
      `INSERT INTO content_sections (section_key, content) 
       VALUES ($1, $2) 
       ON CONFLICT (section_key) 
       DO UPDATE SET content = $2, updated_at = NOW() 
       RETURNING *`,
      [section_key, content]
    );

    // Save to History
    await pool.query(
        `INSERT INTO content_history (section_key, content) VALUES ($1, $2)`,
        [section_key, content]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
