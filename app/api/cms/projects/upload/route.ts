import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { createSecureAPIHandler } from '@/lib/security/middleware';
import { Client, Storage, ID } from 'node-appwrite';

export const POST = createSecureAPIHandler(async (request: Request) => {
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('project_id') as string;

    if (!file || !projectId) {
      return NextResponse.json({ error: 'Missing file or project_id' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    // Initialize Storage
    const storage = new Storage(client);

    // Upload to Appwrite Storage
    const response = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID_ASSETS!,
      ID.unique(),
      file
    );

    // Get file preview URL
    const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID_ASSETS}/files/${response.$id}/preview`;

    return NextResponse.json({ thumbnail_url: fileUrl, success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}, { requireAuth: false });
