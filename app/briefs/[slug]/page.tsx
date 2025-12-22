import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBriefBySlug } from '@/lib/briefs';
import Brief from '@/components/Brief';

export const dynamic = 'force-dynamic';

interface BriefPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BriefPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brief = await getBriefBySlug(slug);

  if (!brief) {
    return {
      title: 'Brief Not Found - Slow Brief',
    };
  }

  return {
    title: `${brief.headline} - Slow Brief`,
    description: brief.freeHtml.substring(0, 160).replace(/<[^>]*>/g, ''),
  };
}

export default async function BriefPage({ params }: BriefPageProps) {
  const { slug } = await params;
  const brief = await getBriefBySlug(slug);

  if (!brief) {
    notFound();
  }

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
        <Brief brief={brief} />
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Slow Brief. One brief per day.</p>
      </footer>
    </div>
  );
}
