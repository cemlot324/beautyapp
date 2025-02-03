import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  // Clear the auth cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
} 