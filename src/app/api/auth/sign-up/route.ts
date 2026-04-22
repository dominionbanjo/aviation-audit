import { upsertUser } from '@/lib/services/user.service';
import { NextResponse } from 'next/server';

// POST /api/auth/sign-up
// Registers a user via Neon Auth then syncs a profile row in our users table
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const baseUrl = process.env.NEON_AUTH_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 500 });
    }

    // Register user via Neon Auth
    const authRes = await fetch(`${baseUrl}/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!authRes.ok) {
      const err = await authRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: (err as { message?: string }).message || 'Registration failed' },
        { status: authRes.status }
      );
    }

    const authData = await authRes.json() as { user?: { id: string; email: string; name: string } };
    const authUser = authData.user;

    if (!authUser) {
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }

    // Upsert into our application users table via service
    const user = await upsertUser({
      id: authUser.id,
      email: authUser.email,
      name: authUser.name,
    });

    const responseHeaders = new Headers();
    const setCookie = authRes.headers.get('set-cookie');
    if (setCookie) responseHeaders.set('set-cookie', setCookie);

    return NextResponse.json(
      { user },
      { status: 201, headers: responseHeaders }
    );
  } catch (err) {
    console.error('[POST /api/auth/sign-up]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
