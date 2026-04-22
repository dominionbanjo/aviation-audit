import { NextResponse } from 'next/server';

// POST /api/auth/logout
// Clears the session cookies by telling Neon Auth to sign out
export async function POST(req: Request) {
  try {
    const baseUrl = process.env.NEON_AUTH_BASE_URL;
    if (baseUrl) {
      await fetch(`${baseUrl}/sign-out`, {
        method: 'POST',
        headers: { Cookie: req.headers.get('cookie') ?? '' },
      });
    }

    // Clear cookies on the response
    const res = NextResponse.json({ success: true });
    res.cookies.delete('neon-auth-session');
    return res;
  } catch (err) {
    console.error('[POST /api/auth/logout]', err);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
