import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
// Uses credentials from environment variables
// Gracefully handles missing credentials during build time
let app: App | undefined;

if (getApps().length === 0) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  // Only initialize if we have valid credentials
  if (privateKey && clientEmail && projectId && privateKey.includes('BEGIN PRIVATE KEY')) {
    try {
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
    }
  }
} else {
  app = getApps()[0];
}

export const adminDb = app ? getFirestore(app) : ({} as Firestore);
export const adminAuth = app ? getAuth(app) : ({} as Auth);
