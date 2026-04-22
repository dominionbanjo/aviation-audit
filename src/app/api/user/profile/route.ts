import { auth } from '@/lib/auth/server';
import { upsertUser, findUserById } from '@/lib/services/user.service';
import { NextResponse } from 'next/server';

// GET /api/user/profile
// Thin route: authenticate → upsert via service → return profile
export async function GET() {
  try {
    // 1. Authenticate via Neon Auth session cookie
    const { data } = await auth.getSession();
    const authUser = data?.user;

    if (!authUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = authUser.email ?? `user-${authUser.id}@aqsams.local`;
    const name = authUser.name ?? '';

    // 2. Upsert into our users table via service
    const user = await upsertUser({
      id: authUser.id,
      email,
      name,
    });

    // 3. Return the canonical user profile
    return NextResponse.json({ user });

  } catch (err) {
    console.error('[GET /api/user/profile]', err);
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
}
