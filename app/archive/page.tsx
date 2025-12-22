import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBriefs } from '@/lib/briefs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Archive - Slow Brief',
  description: 'Chronological archive of all Slow Brief daily briefs.',
};

export default async function ArchivePage() {
  const briefs = await getAllBriefs();

  return (
    <div className="container">
      <header>
        <h1 className="site-title">
          <Link href="/">Slow Brief</Link>
        </h1>
        <p className="tagline">What matters, without the feed.</p>
        <nav>
          <Link href="/archive">Archive</Link>
          <Link href="/about">About</Link>
          <Link href="/manifesto">Manifesto</Link>
          <Link href="/subscribe">Subscribe</Link>
        </nav>
      </header>

      <main>
        <h1>Archive</h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          All briefs, in reverse chronological order.
        </p>

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
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Slow Brief. One brief per day.</p>
      </footer>
    </div>
  );
}
