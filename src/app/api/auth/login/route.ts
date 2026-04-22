import { upsertUser } from '@/lib/services/user.service';
import { NextResponse } from 'next/server';

// POST /api/auth/login
// Validates credentials via Neon Auth and returns the user profile from neon_auth.users_sync
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Use Neon Auth client-auth proxy to attempt login
    const baseUrl = process.env.NEON_AUTH_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 500 });
    }

    const authRes = await fetch(`${baseUrl}/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!authRes.ok) {
      const err = await authRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: (err as { message?: string }).message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    const authDataTyped = await authRes.json() as { user?: { id: string; email: string; name: string } };
    const authUserId = authDataTyped.user?.id;
    const authUserEmail = authDataTyped.user?.email ?? `user-${authDataTyped.user?.id}@aqsams.local`;
    const authUserName = authDataTyped.user?.name ?? '';

    if (!authUserId) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Upsert user on login (handles first-time logins creating the row)
    const user = await upsertUser({
      id: authUserId,
      email: authUserEmail,
      name: authUserName,
    });

    // Forward auth response headers (session cookies) to the client
    const responseHeaders = new Headers();
    const setCookie = authRes.headers.get('set-cookie');
    if (setCookie) responseHeaders.set('set-cookie', setCookie);

    return NextResponse.json({ user }, { headers: responseHeaders });
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
