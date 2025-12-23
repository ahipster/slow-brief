import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBriefs } from '@/lib/briefs';
import { PageLayout } from '@/components/PageLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Archive - Slow Brief',
  description: 'Chronological archive of all Slow Brief daily briefs.',
};

export default async function ArchivePage() {
  const briefs = await getAllBriefs();

  return (
    <PageLayout>
      {briefs.length > 0 ? (
        <ul style={{ listStyle: 'none' }}>
          {briefs.map((brief) => (
            <li key={brief.slug} style={{ marginBottom: '1.5rem' }}>
              <Link href={`/briefs/${brief.slug}`} style={{ textDecoration: 'none' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                    {brief.headline}
                  </h2>
                  <time style={{ fontSize: '0.85rem', color: '#666' }}>
                    {brief.publishDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No briefs published yet.</p>
      )}
    </PageLayout>
  );
}
