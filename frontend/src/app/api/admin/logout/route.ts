import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/logout
 * Clears the admin-token cookie
 */
export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Déconnexion réussie' });
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
