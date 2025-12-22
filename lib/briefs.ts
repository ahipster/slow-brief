import { adminDb } from './firebase-admin';
import { getCurrentUser, checkSubscription } from './auth';

export interface Brief {
  slug: string;
  headline: string;
  freeHtml: string;
  paidHtml?: string; // Only included for subscribers
  publishDate: Date;
  status: 'draft' | 'published';
}

// Get today's published brief
export async function getTodaysBrief(): Promise<Brief | null> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const snapshot = await adminDb
    .collection('briefs')
    .where('status', '==', 'published')
    .where('publishDate', '>=', startOfDay)
    .where('publishDate', '<', endOfDay)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return await enrichBriefWithPaywall(doc);
}

// Get brief by slug with server-side paywall
export async function getBriefBySlug(slug: string): Promise<Brief | null> {
  const snapshot = await adminDb
    .collection('briefs')
    .where('slug', '==', slug)
    .where('status', '==', 'published')
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return await enrichBriefWithPaywall(doc);
}

// Get all published briefs (for archive) - metadata only
export async function getAllBriefs(): Promise<Array<Pick<Brief, 'slug' | 'headline' | 'publishDate'>>> {
  const snapshot = await adminDb
    .collection('briefs')
    .where('status', '==', 'published')
    .orderBy('publishDate', 'desc')
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      slug: data.slug,
      headline: data.headline,
      publishDate: data.publishDate.toDate(),
    };
  });
}

// Server-side paywall enforcement: only include paidHtml for subscribers
async function enrichBriefWithPaywall(doc: FirebaseFirestore.QueryDocumentSnapshot): Promise<Brief> {
  const data = doc.data();
  const user = await getCurrentUser();

  const brief: Brief = {
    slug: data.slug,
    headline: data.headline,
    freeHtml: data.freeHtml,
    publishDate: data.publishDate.toDate(),
    status: data.status,
  };

  // Only include paid content for authenticated subscribers
  if (user) {
    const hasSubscription = await checkSubscription(user.uid);
    if (hasSubscription) {
      brief.paidHtml = data.paidHtml;
    }
  }

  return brief;
}
