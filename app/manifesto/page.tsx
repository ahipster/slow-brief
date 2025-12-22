import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Manifesto - Slow Brief',
  description: 'The editorial manifesto of Slow Brief. Our constitution for reducing noise, not adding to it.',
};

export default function ManifestoPage() {
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
        <h1>Editorial Manifesto</h1>

        <blockquote style={{
          borderLeft: '3px solid #222',
          paddingLeft: '1.5rem',
          margin: '2rem 0',
          fontStyle: 'italic',
          fontSize: '1.05rem',
          lineHeight: 1.8,
        }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Slow Brief exists to reduce noise, not add to it.</strong>
          </p>
          <p style={{ marginBottom: '1rem' }}>
            We publish one brief per day.<br />
            We choose deliberately.<br />
            We omit aggressively.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            We do not chase trends, outrage, or virality.<br />
            We do not optimize for engagement.<br />
            We do not personalize attention.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            We believe judgment matters more than volume.<br />
            We believe understanding takes time.
          </p>
          <p>
            If you read only this, you should feel oriented — not overwhelmed.
          </p>
        </blockquote>

        <section style={{ marginTop: '3rem' }}>
          <p style={{ fontSize: '0.95rem', color: '#666', fontStyle: 'italic' }}>
            This manifesto governs all development decisions and editorial choices.
            It is the constitution of Slow Brief.
          </p>
        </section>

        <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
          <p>
            Learn more <Link href="/about">about Slow Brief</Link>, or <Link href="/subscribe">subscribe</Link> to receive the full brief each day.
          </p>
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Slow Brief. One brief per day.</p>
      </footer>
    </div>
  );
}
