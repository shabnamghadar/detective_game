import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    // Use atob for base64 decoding in Edge Runtime
    const [user, pwd] = atob(authValue).split(':');

    const expectedUser = process.env.BASIC_AUTH_USER || 'detective';
    const expectedPwd = process.env.BASIC_AUTH_PASSWORD || 'secret';

    if (user === expectedUser && pwd === expectedPwd) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  // Apply middleware to all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
