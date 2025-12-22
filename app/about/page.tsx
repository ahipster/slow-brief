import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About - Slow Brief',
  description: 'What Slow Brief is and is not. A daily editorial companion that replaces algorithmic feeds with deliberate judgment.',
};

export default function AboutPage() {
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
        <h1>About Slow Brief</h1>

        <section style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
            Slow Brief is a daily editorial companion that replaces algorithmic feeds with a single,
            deliberate act of judgment. Each day, <strong>exactly one item</strong> is chosen and framed
            calmly, with enough context to understand why it matters — and with restraint about what does not.
          </p>

          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>The Core Promise</h2>
          <p>If you read Slow Brief each day:</p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
            <li>You read <strong>less</strong></li>
            <li>You understand <strong>more</strong></li>
            <li>You feel <strong>calmer</strong></li>
            <li>You stop scrolling</li>
          </ul>
          <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>
            Scarcity is the product.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>✓ Slow Brief IS:</h2>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
            <li>A daily editorial judgment</li>
            <li>A calm reading ritual (5–7 minutes)</li>
            <li>A finite alternative to feeds</li>
            <li>Human-voiced, <strong>never AI-voiced</strong></li>
            <li>Opinionated in selection, neutral in tone</li>
            <li>One brief per day. Always.</li>
          </ul>

          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>✗ Slow Brief IS NOT:</h2>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>A news site</li>
            <li>A feed or aggregator</li>
            <li>A blog</li>
            <li>Personalized content</li>
            <li>Optimized for engagement metrics</li>
            <li>Multiple posts per day</li>
            <li>Categorized or tagged content</li>
            <li>AI-generated prose</li>
          </ul>
        </section>

        <section>
          <p>
            Read our <Link href="/manifesto">manifesto</Link> to understand the editorial philosophy,
            or <Link href="/subscribe">subscribe</Link> to receive the full brief each day.
          </p>
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Slow Brief. One brief per day.</p>
      </footer>
    </div>
  );
}
