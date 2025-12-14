import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { createSecureAPIHandler } from '@/lib/security/middleware';

export const POST = createSecureAPIHandler(async (request: Request) => {
  try {
    const { project_id, url } = await request.json();

    if (!project_id || isNaN(Number(project_id))) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    if (!url || !/^https?:\/\//.test(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Use ScreenshotLayer API for URL snapshots
    const screenshotApiKey = process.env.SCREENSHOT_API_KEY;
    const screenshotApiUrl = process.env.SCREENSHOT_API_URL || 'http://api.screenshotlayer.com/api/capture';

    if (!screenshotApiKey || screenshotApiKey === 'your_screenshot_api_key') {
      return NextResponse.json({ error: 'Screenshot API key not configured' }, { status: 500 });
    }

    // Build the screenshot API URL (ScreenshotLayer format)
    const screenshotUrl = `${screenshotApiUrl}?access_key=${screenshotApiKey}&url=${encodeURIComponent(url)}&width=1200&height=630&format=PNG`;

    // Update project with snapshot URL
    const result = await secureDb.query(
      `UPDATE projects SET snapshot_url = $1, has_snapshot = TRUE, updated_at = NOW() WHERE id = $2 RETURNING id`,
      [screenshotUrl, Number(project_id)]
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ snapshot_url: screenshotUrl, success: true });
  } catch (error) {
    console.error('Snapshot error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({
      error: 'Failed to capture snapshot: ' + (error as Error).message,
      details: error instanceof Error ? error.stack : String(error)
    }, { status: 500 });
  }
}, { requireAuth: true });
