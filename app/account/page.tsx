import { redirect } from 'next/navigation';
import { PageLayout } from '@/components/PageLayout';
import { adminDb } from '@/lib/firebase-admin';
import { getCurrentUser, getUserRole } from '@/lib/auth';
import { AdminPanel } from './AdminPanel';
import type { CandidateRecord, PublishedBriefRecord } from './types';

async function getCandidates(): Promise<CandidateRecord[]> {
  const snapshot = await adminDb
    .collection('briefs_candidates')
    .orderBy('updatedAt', 'desc')
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug ?? '',
      headline: data.headline ?? '',
      freeHtml: data.freeHtml ?? '',
      paidHtml: data.paidHtml ?? '',
      toc: data.toc ?? [],
      sections: data.sections ?? [],
      publishDate: data.publishDate ? data.publishDate.toDate().toISOString() : null,
      status: data.status ?? 'candidate',
      updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : '',
    };
  });
}

async function getPublishedBriefs(): Promise<PublishedBriefRecord[]> {
  const snapshot = await adminDb
    .collection('briefs')
    .where('status', '==', 'published')
    .orderBy('publishDate', 'desc')
    .limit(25)
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      slug: data.slug ?? '',
      headline: data.headline ?? '',
      freeHtml: data.freeHtml ?? '',
      paidHtml: data.paidHtml ?? '',
      toc: data.toc ?? [],
      sections: data.sections ?? [],
      publishDate: data.publishDate ? data.publishDate.toDate().toISOString() : '',
      status: data.status ?? 'published',
      updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : '',
    };
  });
}

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const role = await getUserRole(user.uid);
  if (role !== 'admin') {
    redirect('/subscribe');
  }

  const [candidates, published] = await Promise.all([
    getCandidates(),
    getPublishedBriefs(),
  ]);

  return (
    <PageLayout>
      <h1>Admin</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Upload, review, schedule, and publish briefs. Times are UTC.
      </p>
      <AdminPanel initialCandidates={candidates} initialPublished={published} />
    </PageLayout>
  );
}
