import { NextResponse } from 'next/server';
import { createSessionCookie } from '@/lib/auth';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    const sessionCookie = await createSessionCookie(idToken);

    // Verify ID token to get user info and persist to Firestore
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      const uid = decoded.uid;
      const email = decoded.email || '';
      const name = (decoded.name as string) || '';

      if (adminDb && uid) {
        await adminDb.collection('users').doc(uid).set({
          email,
          displayName: name,
          lastSeen: FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Failed to persist user to Firestore:', err);
    }

    const secure = process.env.NODE_ENV === 'production';

    const res = NextResponse.json({ ok: true });
    res.headers.set('Set-Cookie', `session=${sessionCookie}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 14}; SameSite=Lax${secure ? '; Secure' : ''}`);

    return res;
  } catch (err: any) {
    console.error('Session creation error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create session' }, { status: 500 });
  }
}
