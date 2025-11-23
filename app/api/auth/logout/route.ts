import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response that clears the admin_token cookie
    const response = NextResponse.json({ success: true });
    
    // Clear the cookie by setting it to expire in the past
    response.cookies.set('admin_token', '', {
      path: '/',
      expires: new Date(0), // Thu, 01 Jan 1970 00:00:00 GMT
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
