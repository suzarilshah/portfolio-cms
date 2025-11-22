import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { stackServerApp } from '@/stack';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
  }

  try {
    const result = await pool.query(
        'SELECT * FROM project_history WHERE project_id = $1 ORDER BY created_at DESC',
        [projectId]
    );
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
    const { history_id } = body;

    // Fetch the snapshot from history
    const historyRes = await pool.query('SELECT * FROM project_history WHERE id = $1', [history_id]);
    if (historyRes.rows.length === 0) {
        return NextResponse.json({ error: 'History record not found' }, { status: 404 });
    }

    const snapshot = historyRes.rows[0].snapshot;
    const projectId = historyRes.rows[0].project_id;

    // Restore the project to this state
    // We assume the snapshot contains all fields of the 'projects' table
    const { 
        title, tagline, challenge, solution, impact, 
        technologies, category, icon_name, year, link 
    } = snapshot;

    const result = await pool.query(
      `UPDATE projects SET 
        title = $1, tagline = $2, challenge = $3, solution = $4, 
        impact = $5, technologies = $6, category = $7, 
        icon_name = $8, year = $9, link = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        title, tagline, challenge, solution, 
        JSON.stringify(impact), JSON.stringify(technologies), 
        category, icon_name, year, link, projectId
      ]
    );
    
    const restoredProject = result.rows[0];

    // Save a new history record indicating this restoration
    await pool.query(
        `INSERT INTO project_history (project_id, snapshot) VALUES ($1, $2)`,
        [projectId, JSON.stringify(restoredProject)]
    );

    return NextResponse.json(restoredProject);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
