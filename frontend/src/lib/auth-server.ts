import { pbkdf2Sync, randomBytes, randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './db';

const SESSION_COOKIE_NAME = 'session-id';
const SESSION_DURATION_DAYS = 7;

/**
 * Hash a password using Node.js pbkdf2 (zero external dependencies)
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password matches the stored hash
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const verifyHash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

/**
 * Create a new database session and set session cookie
 */
export async function createSession(userId: string) {
  const sessionId = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  // Store in database
  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt,
    },
  });

  // Set httpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60, // 7 days in seconds
  });

  return sessionId;
}

/**
 * Retrieve current logged in user based on session cookie
 */
export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionId) return null;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            company: true,
            phone: true,
            activitySector: true,
            googleId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!session) return null;

    // Check expiration
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
      const cookieStore = await cookies();
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('[auth-server] getSessionUser error:', error);
    return null;
  }
}

/**
 * Delete current session from database and clear the cookie
 */
export async function deleteSession() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (sessionId) {
      await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error('[auth-server] deleteSession error:', error);
  }
}
