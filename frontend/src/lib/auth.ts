import { NextRequest } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * Returns the expected token derived from the ADMIN_PASSWORD
 */
export function getExpectedToken(): string {
  return Buffer.from(ADMIN_PASSWORD).toString('base64');
}

/**
 * Verifies if the request contains a valid admin token cookie
 */
export function verifyAdminSession(req: NextRequest): boolean {
  const token = req.cookies.get('admin-token')?.value;
  if (!token) return false;
  return token === getExpectedToken();
}
