import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { SecurityMiddleware } from '@/lib/security/middleware';
import { addDefaultSecurityHeaders } from '@/lib/security/headers';
import { getUploadPolicy } from '@/lib/storage-policy';
import { secureDb } from '@/lib/security/database';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Upload service not configured' }, { status: 503 });
  }

  try {
    const body = await request.json() as HandleUploadBody;
    if (body.type !== 'blob.generate-client-token' && body.type !== 'blob.upload-completed') {
      return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
    }

    // Completion callbacks are verified by handleUpload using the Blob signature.
    // Token issuance must authenticate the browser before granting storage access.
    if (body.type === 'blob.generate-client-token') {
      const denied = await SecurityMiddleware.handle(request, {
        requireAdmin: true, requireCSRF: true,
        rateLimit: { windowMs: 60000, maxRequests: 20 },
      });
      if (denied) return denied;
    }

    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        const policy = getUploadPolicy(pathname);
        if (policy.projectId) {
          const project = await secureDb.query('SELECT id FROM projects WHERE id = $1', [policy.projectId]);
          if (!project.length) throw new Error('Project not found');
        }
        return {
          allowedContentTypes: policy.allowedContentTypes,
          maximumSizeInBytes: policy.maximumSizeInBytes,
          addRandomSuffix: true,
          allowOverwrite: false,
          validUntil: Date.now() + 15 * 60 * 1000,
        };
      },
    });
    return addDefaultSecurityHeaders(NextResponse.json(result));
  } catch (error) {
    console.error('Upload request failed:', error);
    return NextResponse.json({ error: 'Upload request rejected' }, { status: 400 });
  }
}
