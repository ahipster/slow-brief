import { Metadata } from 'next';
import Link from 'next/link';
import { getTodaysBrief } from '@/lib/briefs';
import Brief from '@/components/Brief';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Slow Brief - What matters, without the feed',
  description: 'One daily brief. Deliberate judgment over algorithmic feeds. Read less, understand more, feel calmer.',
};

export default async function HomePage() {
  const brief = await getTodaysBrief();

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
        {brief ? (
          <Brief brief={brief} />
        ) : (
          <p>No brief published today. Check back tomorrow.</p>
        )}
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Slow Brief. One brief per day.</p>
      </footer>
    </div>
  );
}
