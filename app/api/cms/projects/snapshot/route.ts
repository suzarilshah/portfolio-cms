import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { stackServerApp } from '@/stack';
import { createSecureAPIHandler } from '@/lib/security/middleware';

export const POST = createSecureAPIHandler(async (request: Request) => {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { project_id, url } = await request.json();

    if (!project_id || isNaN(Number(project_id))) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    if (!url || !/^https?:\/\//.test(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Use screenshot API service (e.g., screenshotapi.net, urlbox.io, or screenshotlayer.com)
    const screenshotApiKey = process.env.SCREENSHOT_API_KEY;
    const screenshotApiUrl = process.env.SCREENSHOT_API_URL || 'https://api.screenshotapi.net/screen';

    if (!screenshotApiKey || screenshotApiKey === 'your_screenshot_api_key') {
      return NextResponse.json({ error: 'Screenshot API key not configured' }, { status: 500 });
    }

    const screenshotUrl = `${screenshotApiUrl}?url=${encodeURIComponent(url)}&token=${screenshotApiKey}&width=1200&height=630&output=image&file_type=png`;

    // Update project with snapshot URL
    const result = await secureDb.query(
      `UPDATE projects SET snapshot_url = $1, has_snapshot = TRUE, updated_at = NOW() WHERE id = $2 RETURNING id`,
      [screenshotUrl, project_id]
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ snapshot_url: screenshotUrl, success: true });
  } catch (error) {
    console.error('Snapshot error:', error);
    return NextResponse.json({ error: 'Failed to capture snapshot: ' + (error as Error).message }, { status: 500 });
  }
}, { requireAuth: false });
