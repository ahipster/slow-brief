'use server';

import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-admin';
import { getCurrentUser, getUserRole } from '@/lib/auth';
import { CandidateInput } from './types';

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated.');
  }

  const role = await getUserRole(user.uid);
  if (role !== 'admin') {
    throw new Error('Not authorized.');
  }

  return user;
}

function parsePublishDate(dateValue: string | null) {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid publish date.');
  }

  if (
    date.getUTCMinutes() !== 0 ||
    date.getUTCSeconds() !== 0 ||
    date.getUTCMilliseconds() !== 0 ||
    date.getUTCHours() % 4 !== 0
  ) {
    throw new Error('Publish date must be aligned to the 4-hour UTC cadence (00:00, 04:00, 08:00, 12:00, 16:00, 20:00).');
  }

  return Timestamp.fromDate(date);
}

export async function createCandidates(records: CandidateInput[]) {
  await requireAdmin();

  if (!records.length) {
    return { created: 0 };
  }

  const batch = adminDb.batch();
  let created = 0;

  records.forEach(record => {
    if (!record.slug || !record.headline || !record.freeHtml || !record.paidHtml) {
      throw new Error('Missing required fields in candidate record.');
    }

    if (countWords(record.freeHtml) > 200) {
      throw new Error(`Free section exceeds 200 words for "${record.slug}".`);
    }

    const now = Timestamp.now();
    const publishDate = parsePublishDate(record.publishDate);
    const status = publishDate ? 'scheduled' : 'candidate';

    const docRef = adminDb.collection('briefs_candidates').doc();
    batch.set(docRef, {
      slug: record.slug.trim(),
      headline: record.headline.trim(),
      freeHtml: record.freeHtml,
      paidHtml: record.paidHtml,
      publishDate,
      status,
      createdAt: now,
      updatedAt: now,
    });
    created += 1;
  });

  await batch.commit();
  revalidatePath('/account');
  return { created };
}

export async function updateCandidate(candidateId: string, updates: CandidateInput & { status: 'candidate' | 'scheduled' }) {
  await requireAdmin();

  if (!candidateId) {
    throw new Error('Missing candidate id.');
  }

  if (countWords(updates.freeHtml) > 200) {
    throw new Error('Free section exceeds 200 words.');
  }

  const publishDate = parsePublishDate(updates.publishDate);

  await adminDb.collection('briefs_candidates').doc(candidateId).update({
    slug: updates.slug.trim(),
    headline: updates.headline.trim(),
    freeHtml: updates.freeHtml,
    paidHtml: updates.paidHtml,
    publishDate,
    status: publishDate ? 'scheduled' : updates.status,
    updatedAt: Timestamp.now(),
  });

  revalidatePath('/account');
  return { updated: true };
}

export async function publishCandidate(candidateId: string) {
  await requireAdmin();

  const candidateRef = adminDb.collection('briefs_candidates').doc(candidateId);
  const candidateSnap = await candidateRef.get();

  if (!candidateSnap.exists) {
    throw new Error('Candidate not found.');
  }

  const data = candidateSnap.data();
  if (!data?.slug || !data?.headline || !data?.freeHtml || !data?.paidHtml) {
    throw new Error('Candidate record is incomplete.');
  }

  const publishDate = data.publishDate ?? Timestamp.now();

  const existing = await adminDb
    .collection('briefs')
    .where('slug', '==', data.slug)
    .limit(1)
    .get();

  if (!existing.empty) {
    throw new Error(`A brief with slug "${data.slug}" already exists.`);
  }

  const briefRef = adminDb.collection('briefs').doc();
  await briefRef.set({
    slug: data.slug,
    headline: data.headline,
    freeHtml: data.freeHtml,
    paidHtml: data.paidHtml,
    publishDate,
    status: 'published',
    updatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
  });

  await candidateRef.update({
    status: 'published',
    updatedAt: Timestamp.now(),
  });

  revalidatePath('/account');
  return { published: true };
}

export async function updatePublishedBrief(
  briefId: string,
  updates: CandidateInput,
) {
  await requireAdmin();

  if (!briefId) {
    throw new Error('Missing brief id.');
  }

  if (countWords(updates.freeHtml) > 200) {
    throw new Error('Free section exceeds 200 words.');
  }

  const publishDate = parsePublishDate(updates.publishDate) ?? Timestamp.now();

  await adminDb.collection('briefs').doc(briefId).update({
    slug: updates.slug.trim(),
    headline: updates.headline.trim(),
    freeHtml: updates.freeHtml,
    paidHtml: updates.paidHtml,
    publishDate,
    updatedAt: Timestamp.now(),
  });

  revalidatePath('/account');
  return { updated: true };
}
