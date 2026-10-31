'use client';

import { upload } from '@vercel/blob/client';
import { getUploadPath, getUploadPolicy } from './storage-policy';

export async function uploadPortfolioFile(file: File, projectId?: number) {
  const pathname = getUploadPath(file.name, projectId);
  const policy = getUploadPolicy(pathname);
  if (!file.size || file.size > policy.maximumSizeInBytes) {
    throw new Error(`File must be between 1 byte and ${policy.maximumSizeInBytes / 1024 / 1024}MB`);
  }

  // Transfer bytes directly to storage to support files above the function body limit.
  const blob = await upload(pathname, file, {
    access: 'public',
    contentType: policy.contentType,
    handleUploadUrl: '/api/upload',
    multipart: file.size > 4 * 1024 * 1024,
  });

  if (projectId) {
    const response = await fetch('/api/cms/projects/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, url: blob.url }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to save thumbnail');
    }
  }

  return blob;
}
