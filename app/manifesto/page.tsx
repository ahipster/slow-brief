import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'Manifesto - Slow Brief',
  description: 'The editorial manifesto of Slow Brief. Our constitution for reducing noise, not adding to it.',
};

export default function ManifestoPage() {
  return (
    <PageLayout>
      <section style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
          Slow Brief is a daily editorial companion that replaces algorithmic feeds with a single,
          deliberate act of judgment. Each day, briefs are chosen and framed
          calmly, with enough context to understand why it matters — and with restraint about what does not.
        </p>
      </section>

      <section className="card-grid">
        <div className="content-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>✓ Slow Brief IS</h2>
          <ul style={{ marginLeft: '1.25rem' }}>
            <li>A daily editorial judgment</li>
            <li>A calm reading ritual</li>
            <li>A finite alternative to feeds</li>
            <li>Human-voiced</li>
            <li>Opinionated in selection</li>
            <li>Neutral in tone</li>
          </ul>
        </div>
        <div className="content-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>✗ Slow Brief IS NOT</h2>
          <ul style={{ marginLeft: '1.25rem' }}>
            <li>A news site</li>
            <li>A feed or aggregator</li>
            <li>A blog</li>
            <li>Personalized content</li>
            <li>Optimized for engagement metrics</li>
            <li>AI-generated spam</li>
          </ul>
        </div>
      </section>

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
          <Link href="/subscribe">Subscribe</Link> to receive the full brief each day.
        </p>
      </section>
    </PageLayout>
  );
}
