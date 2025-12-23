import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from './firebase-client';
import { adminAuth, adminDb } from './firebase-admin';
import { cookies } from 'next/headers';

// Client-side: Send magic link email
export async function sendMagicLink(email: string, redirectUrl: string) {
  const actionCodeSettings = {
    url: redirectUrl,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  // Store email locally for sign-in completion
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('emailForSignIn', email);
  }
}

// Server-side: Get current user from session cookie
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    return null;
  }
}

// Server-side: Check if user has active subscription
export async function checkSubscription(uid: string): Promise<boolean> {
  try {
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    return userData?.subscriptionStatus === 'active';
  } catch (error) {
    return false;
  }
}

export async function getUserRole(uid: string): Promise<string | null> {
  try {
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    return userData?.role ?? null;
  } catch (error) {
    return null;
  }
}

// Server-side: Create session cookie from ID token
export async function createSessionCookie(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
  return sessionCookie;
}
