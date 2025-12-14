import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { createSecureAPIHandler } from '@/lib/security/middleware';

// Prototype Pollution Protection: Validate projectId is a number
function validateProjectId(projectId: string): boolean {
  const num = parseInt(projectId);
  return !isNaN(num) && num > 0;
}

export const GET = createSecureAPIHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
  }

  // Validate projectId is a positive integer
  if (!validateProjectId(projectId)) {
    return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
  }

  try {
    const result = await secureDb.query(
      'SELECT * FROM project_history WHERE project_id = $1 ORDER BY created_at DESC',
      [parseInt(projectId)]
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
});

export const POST = createSecureAPIHandler(async (request: Request) => {
  try {
    const body = await request.json();
    const { history_id } = body;

    // Validate history_id
    if (!history_id) {
      return NextResponse.json({ error: 'History ID required' }, { status: 400 });
    }

    const historyIdNum = parseInt(String(history_id));
    if (isNaN(historyIdNum) || historyIdNum <= 0) {
      return NextResponse.json({ error: 'Invalid history ID' }, { status: 400 });
    }

    // Fetch the snapshot from history
    const historyRes = await secureDb.query('SELECT * FROM project_history WHERE id = $1', [historyIdNum]);
    if (historyRes.length === 0) {
      return NextResponse.json({ error: 'History record not found' }, { status: 404 });
    }

    let snapshot;
    let projectId;
    try {
      // Parse and validate snapshot structure
      snapshot = JSON.parse(historyRes[0].snapshot);
      projectId = historyRes[0].project_id;

      // Validate projectId
      if (!validateProjectId(String(projectId))) {
        return NextResponse.json({ error: 'Invalid project ID in snapshot' }, { status: 400 });
      }
    } catch (e) {
      return NextResponse.json({ error: 'Invalid snapshot format' }, { status: 400 });
    }

    // Prototype Pollution Protection: Only extract expected fields
    const allowedFields = ['title', 'tagline', 'challenge', 'solution', 'impact', 'technologies', 'category', 'icon_name', 'year', 'link'];
    const safeSnapshot: any = {};

    for (const field of allowedFields) {
      if (snapshot.hasOwnProperty(field)) {
        safeSnapshot[field] = snapshot[field];
      }
    }

    // Validate required fields
    if (!safeSnapshot.title || !safeSnapshot.category) {
      return NextResponse.json({ error: 'Snapshot missing required fields' }, { status: 400 });
    }

    const result = await secureDb.query(
      `UPDATE projects SET
        title = $1, tagline = $2, challenge = $3, solution = $4,
        impact = $5, technologies = $6, category = $7,
        icon_name = $8, year = $9, link = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        safeSnapshot.title,
        safeSnapshot.tagline || '',
        safeSnapshot.challenge || '',
        safeSnapshot.solution || '',
        JSON.stringify(safeSnapshot.impact || {}),
        JSON.stringify(safeSnapshot.technologies || []),
        safeSnapshot.category,
        safeSnapshot.icon_name || '',
        safeSnapshot.year || new Date().getFullYear(),
        safeSnapshot.link || '',
        parseInt(String(projectId))
      ]
    );

    const restoredProject = result[0];

    // Save a new history record indicating this restoration
    await secureDb.query(
      `INSERT INTO project_history (project_id, snapshot) VALUES ($1, $2)`,
      [parseInt(String(projectId)), JSON.stringify(restoredProject)]
    );

    return NextResponse.json(restoredProject);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAuth: true });
