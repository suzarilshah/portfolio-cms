import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { stackServerApp } from '@/stack';

export async function GET() {
  try {
    const result = await pool.query('SELECT section_key, sort_order, is_visible FROM content_sections ORDER BY sort_order ASC');
    return NextResponse.json(result.rows);
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
    const { sections } = body; // Array of { section_key, sort_order, is_visible }

    if (!Array.isArray(sections)) {
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    // Perform updates in a transaction for atomicity
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        for (const section of sections) {
            await client.query(
                `UPDATE content_sections 
                 SET sort_order = $1, is_visible = $2, updated_at = NOW()
                 WHERE section_key = $3`,
                [section.sort_order, section.is_visible, section.section_key]
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
