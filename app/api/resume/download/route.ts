import { NextResponse } from 'next/server';
import { secureDb } from '@/lib/security/database';
import { createSecureAPIHandler } from '@/lib/security/middleware';

export const POST = createSecureAPIHandler(async (request: Request) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await secureDb.query(
      'SELECT id FROM resume_downloads WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    // Insert email into database
    await secureDb.query(
      `INSERT INTO resume_downloads (email, downloaded_at)
       VALUES ($1, NOW())
       ON CONFLICT (email) DO UPDATE SET downloaded_at = NOW()`,
      [email.toLowerCase().trim()]
    );

    return NextResponse.json({ success: true, message: 'Email recorded successfully' });
  } catch (error) {
    console.error('Resume download error:', error);
    return NextResponse.json(
      { error: 'Failed to record email' },
      { status: 500 }
    );
  }
}, { requireAuth: false });
