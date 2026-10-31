export const IMAGE_CONTENT_TYPES = [
  'image/png', 'image/jpeg', 'image/svg+xml', 'image/webp',
  'image/x-icon', 'image/vnd.microsoft.icon',
];

export const DOCUMENT_CONTENT_TYPES = [
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  svg: 'image/svg+xml', webp: 'image/webp', ico: 'image/x-icon',
  pdf: 'application/pdf', doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export function getUploadPolicy(pathname: string) {
  const projectMatch = pathname.match(/^portfolio-assets\/projects\/([1-9]\d*)\/[a-zA-Z0-9._-]+$/);
  const isDocument = /^portfolio-docs\/[a-zA-Z0-9._-]+$/.test(pathname);
  const isAsset = /^portfolio-assets\/[a-zA-Z0-9._-]+$/.test(pathname);
  if (!projectMatch && !isDocument && !isAsset) throw new Error('Invalid upload path');

  const extension = pathname.split('.').pop()?.toLowerCase() || '';
  const contentType = CONTENT_TYPES[extension];
  const allowedContentTypes = isDocument ? DOCUMENT_CONTENT_TYPES : IMAGE_CONTENT_TYPES;
  if (!contentType || !allowedContentTypes.includes(contentType)) throw new Error('Unsupported file type');

  return {
    allowedContentTypes,
    contentType,
    maximumSizeInBytes: (projectMatch ? 5 : 15) * 1024 * 1024,
    projectId: projectMatch ? Number(projectMatch[1]) : undefined,
  };
}

export function getUploadPath(filename: string, projectId?: number) {
  const sanitizedName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const extension = sanitizedName.split('.').pop()?.toLowerCase() || '';
  const isDocument = DOCUMENT_CONTENT_TYPES.includes(CONTENT_TYPES[extension]);
  const prefix = projectId ? `portfolio-assets/projects/${projectId}` : isDocument ? 'portfolio-docs' : 'portfolio-assets';
  return `${prefix}/${sanitizedName}`;
}
