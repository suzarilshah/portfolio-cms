import { NextResponse } from 'next/server';
import { head } from '@vercel/blob';
import { createSecureAPIHandler } from '@/lib/security/middleware';
import { secureDb } from '@/lib/security/database';
import { getUploadPolicy } from '@/lib/storage-policy';

export const runtime = 'nodejs';

export const POST = createSecureAPIHandler(async (request) => {
  try {
    const { project_id, url } = await request.json();
    const projectId = Number(project_id);
    if (!Number.isSafeInteger(projectId) || projectId <= 0 || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid project_id or URL' }, { status: 400 });
    }

    const parsedUrl = new URL(url);
    const pathname = decodeURIComponent(parsedUrl.pathname.slice(1));
    const policy = getUploadPolicy(pathname);
    if (policy.projectId !== projectId) {
      return NextResponse.json({ error: 'Thumbnail does not belong to this project' }, { status: 400 });
    }

    // Lookup by pathname in our configured store, never trust a client-supplied host.
    const blob = await head(pathname);
    if (blob.url !== url || !policy.allowedContentTypes.includes(blob.contentType) || blob.size > policy.maximumSizeInBytes) {
      return NextResponse.json({ error: 'Invalid thumbnail' }, { status: 400 });
    }

    const updated = await secureDb.query(
      'UPDATE projects SET thumbnail_url = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      [blob.url, projectId]
    );
    if (!updated.length) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    return NextResponse.json({ thumbnail_url: blob.url, success: true });
  } catch (error) {
    console.error('Thumbnail save failed:', error);
    return NextResponse.json({ error: 'Failed to save thumbnail' }, { status: 400 });
  }
}, { requireAdmin: true, requireCSRF: true });
