import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { stackServerApp } from '@/stack';
import { SecurityValidator } from '@/lib/security/validation';
import { createSecureAPIHandler } from '@/lib/security/middleware';
import { getClientIdentifier, apiRateLimiter, createRateLimitResponse } from '@/lib/security/rate-limiter';
import { addDefaultSecurityHeaders } from '@/lib/security/headers';

export const GET = createSecureAPIHandler(async () => {
  try {
    const result = await secureDb.query('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC');
    return NextResponse.json(result);
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
    
    // Validate and sanitize input
    const validation = SecurityValidator.validateProjectInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }
    
    const sanitized = validation.sanitized!;

    const result = await secureDb.query(
      `INSERT INTO projects (title, tagline, challenge, solution, impact, technologies, category, icon_name, year, link) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        sanitized.title, sanitized.tagline, sanitized.challenge, sanitized.solution, 
        JSON.stringify(sanitized.impact), JSON.stringify(sanitized.technologies), 
        sanitized.category, sanitized.icon_name, sanitized.year, sanitized.link
      ]
    );

    // Save initial history snapshot
    const newProject = result[0];
    await secureDb.query(
        `INSERT INTO project_history (project_id, snapshot) VALUES ($1, $2)`,
        [newProject.id, JSON.stringify(newProject)]
    );
    
    return NextResponse.json(newProject);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}, { requireAuth: true });

export const PUT = createSecureAPIHandler(async (request: Request) => {
    const user = await stackServerApp.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        
        // Validate and sanitize input
        const validation = SecurityValidator.validateProjectInput(body);
        if (!validation.isValid) {
            return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
        }
        
        const sanitized = validation.sanitized!;
        const { id } = sanitized;

        const fields = Object.keys(sanitized).filter(key => key !== 'id').map((key, i) => {
            if (key === 'impact' || key === 'technologies') {
                 return `${key} = $${i + 2}::jsonb`;
            }
            return `${key} = $${i + 2}`;
        });
        
        const values = Object.values(sanitized).filter((_, index) => index !== Object.keys(sanitized).indexOf('id')).map(val => {
             if (Array.isArray(val)) return JSON.stringify(val);
             return val;
        });

        const query = `UPDATE projects SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`;
        const result = await secureDb.query(query, [id, ...values]);
        
        // Save history snapshot
        const updatedProject = result[0];
        await secureDb.query(
            `INSERT INTO project_history (project_id, snapshot) VALUES ($1, $2)`,
            [updatedProject.id, JSON.stringify(updatedProject)]
        );

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}, { requireAuth: true });

export const DELETE = createSecureAPIHandler(async (request: Request) => {
    const user = await stackServerApp.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id || !/^[0-9]+$/.test(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }
        
        await secureDb.query('DELETE FROM projects WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}, { requireAuth: true });
