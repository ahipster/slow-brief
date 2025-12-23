import { NextResponse } from 'next/server';

export async function POST() {
  const secure = process.env.NODE_ENV === 'production';
  const res = NextResponse.json({ ok: true });
  res.headers.set(
    'Set-Cookie',
    `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure ? '; Secure' : ''}`
  );
  return res;
}
