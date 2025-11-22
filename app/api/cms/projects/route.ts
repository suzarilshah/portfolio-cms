import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { stackServerApp } from '@/stack';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC');
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
    const { 
        title, tagline, challenge, solution, impact, 
        technologies, category, icon_name, year, link 
    } = body;

    const result = await pool.query(
      `INSERT INTO projects (title, tagline, challenge, solution, impact, technologies, category, icon_name, year, link) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        title, tagline, challenge, solution, 
        JSON.stringify(impact), JSON.stringify(technologies), 
        category, icon_name, year, link
      ]
    );

    // Save initial history snapshot
    const newProject = result.rows[0];
    await pool.query(
        `INSERT INTO project_history (project_id, snapshot) VALUES ($1, $2)`,
        [newProject.id, JSON.stringify(newProject)]
    );
    
    return NextResponse.json(newProject);
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
        const { id, ...updates } = body;

        const fields = Object.keys(updates).map((key, i) => {
            if (key === 'impact' || key === 'technologies') {
                 return `${key} = $${i + 2}::jsonb`;
            }
            return `${key} = $${i + 2}`;
        });
        const values = Object.values(updates).map(val => {
             if (Array.isArray(val)) return JSON.stringify(val);
             return val;
        });

        const query = `UPDATE projects SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id, ...values]);
        
        // Save history snapshot
        const updatedProject = result.rows[0];
        await pool.query(
            `INSERT INTO project_history (project_id, snapshot) VALUES ($1, $2)`,
            [updatedProject.id, JSON.stringify(updatedProject)]
        );

        return NextResponse.json(updatedProject);
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
        
        await pool.query('DELETE FROM projects WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
