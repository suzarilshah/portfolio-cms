import { NextRequest, NextResponse } from 'next/server';
import { Client, Storage, ID, Permission, Role } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

// Ensure Node.js runtime (Appwrite SDK + Buffer not available on Edge)
export const runtime = 'nodejs';

// Allowed sets for both docs and images
const ALLOWED_DOC_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/webp',
  'image/x-icon',
  'image/vnd.microsoft.icon',
]);
const ALLOWED_DOC_EXTS = new Set(['pdf', 'doc', 'docx']);
const ALLOWED_IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'svg', 'webp', 'ico']);
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest) {
    try {
        // Validate env config
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        const apiKey = process.env.APPWRITE_API_KEY;
        const BUCKET_DEFAULT = process.env.APPWRITE_BUCKET_ID || 'portfolio-assets';
        const BUCKET_DOCS = process.env.APPWRITE_BUCKET_ID_DOCS || BUCKET_DEFAULT;
        const BUCKET_ASSETS = process.env.APPWRITE_BUCKET_ID_ASSETS || BUCKET_DEFAULT;

        if (!endpoint || !project || !apiKey) {
            return NextResponse.json(
              { error: 'Upload service not configured. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, and APPWRITE_API_KEY in your environment.' },
              { status: 500 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Basic validations (type/size)
        const contentType = (file as any).type as string | undefined;
        const fileSize = (file as any).size as number | undefined;

        const originalName = ((file as any).name as string | undefined) || 'upload.file';
        const ext = originalName.includes('.') ? originalName.split('.').pop()!.toLowerCase() : '';

        const isDoc = !!(ALLOWED_DOC_EXTS.has(ext) || (contentType && ALLOWED_DOC_TYPES.has(contentType)));
        const isImage = !!(ALLOWED_IMAGE_EXTS.has(ext) || (contentType && ALLOWED_IMAGE_TYPES.has(contentType)));

        if (!isDoc && !isImage) {
            return NextResponse.json(
              { error: 'Unsupported file type. Allowed: PDF, DOC, DOCX, PNG, JPG, JPEG, SVG, WEBP, ICO.' },
              { status: 400 }
            );
        }
        if (typeof fileSize === 'number' && fileSize > MAX_SIZE_BYTES) {
            return NextResponse.json(
              { error: `File too large. Max size is ${Math.floor(MAX_SIZE_BYTES / (1024 * 1024))}MB.` },
              { status: 400 }
            );
        }

        // Convert to buffer for node-appwrite
        const buffer = Buffer.from(await file.arrayBuffer());
        const inputFile = InputFile.fromBuffer(buffer, file.name);

        // Initialize client lazily (after env validation)
        const client = new Client()
            .setEndpoint(endpoint)
            .setProject(project)
            .setKey(apiKey);

        const storage = new Storage(client);

        // Route to appropriate bucket based on file kind
        const targetBucket = isDoc ? BUCKET_DOCS : BUCKET_ASSETS;

        const result = await storage.createFile(
          targetBucket,
          ID.unique(),
          inputFile,
          [Permission.read(Role.any())]
        );

        // Construct View URL
        // Format: https://[ENDPOINT]/storage/buckets/[BUCKET_ID]/files/[FILE_ID]/view?project=[PROJECT_ID]
        const endpointTrimmed = endpoint.replace(/\/$/, '');
        const fileUrl = `${endpointTrimmed}/storage/buckets/${targetBucket}/files/${result.$id}/view?project=${project}`;
        
        return NextResponse.json({ url: fileUrl });
    } catch (error: any) {
        console.error('Upload error:', error);
        // Helpful Appwrite-specific messaging
        const message: string =
          (error?.response && (typeof error.response === 'string' ? error.response : error.response?.message)) ||
          error?.message ||
          'Unknown upload error';

        // Common bucket missing or extension-restricted scenario
        if (/bucket/i.test(message) && /not found|missing/i.test(message)) {
          return NextResponse.json(
            { error: 'Storage bucket not found. Ensure APPWRITE_BUCKET_ID (or default "portfolio-assets") exists and is accessible.' },
            { status: 500 }
          );
        }
        if (/file extension not allowed/i.test(message) || /storage_file_type_unsupported/i.test(message)) {
          return NextResponse.json(
            { error: 'File extension not allowed in this bucket. Add the extension to allowedFileExtensions in Appwrite or configure APPWRITE_BUCKET_ID_DOCS and APPWRITE_BUCKET_ID_ASSETS.' },
            { status: 400 }
          );
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
