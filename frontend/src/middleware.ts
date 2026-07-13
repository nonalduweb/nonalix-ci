import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware running on Edge to pass the current pathname in headers.
 * Next.js Layouts do not have direct access to the pathname/URL, so this
 * header allows us to conditionally render the maintenance view.
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Ensure the middleware runs for all page routes (exclude static files and Next.js internals)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
