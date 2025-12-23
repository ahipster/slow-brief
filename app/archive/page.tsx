import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBriefs } from '@/lib/briefs';
import { PageLayout } from '@/components/PageLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Past - Slow Brief',
  description: 'Past briefs from Slow Brief in reverse chronological order.',
};

export default async function ArchivePage() {
  const briefs = await getAllBriefs();
  const now = new Date();
  const nowUtcStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });

  const groups = briefs.reduce<Array<{ label: string; key: string; highlight?: boolean; items: typeof briefs }>>(
    (acc, brief) => {
      const briefDate = brief.publishDate;
      const briefUtcStart = Date.UTC(
        briefDate.getUTCFullYear(),
        briefDate.getUTCMonth(),
        briefDate.getUTCDate(),
      );
      const dayDiff = Math.floor((nowUtcStart - briefUtcStart) / (24 * 60 * 60 * 1000));

      let key = '';
      let label = '';
      let highlight = false;

      if (dayDiff === 0) {
        key = 'today';
        label = 'Today';
        highlight = true;
      } else if (dayDiff === 1) {
        key = 'yesterday';
        label = 'Yesterday';
      } else if (dayDiff <= 7) {
        key = 'last-week';
        label = 'Last Week';
      } else if (dayDiff <= 30) {
        key = 'past-month';
        label = 'Past Month';
      } else {
        const year = briefDate.getUTCFullYear();
        const monthName = monthFormatter.format(briefDate);
        key = `${year}-${briefDate.getUTCMonth()}`;
        label = `${year} ${monthName}`;
      }

      const existing = acc.find(group => group.key === key);
      if (existing) {
        existing.items.push(brief);
      } else {
        acc.push({ key, label, highlight, items: [brief] });
      }

      return acc;
    },
    [],
  );

  return (
    <PageLayout>
      {briefs.length > 0 ? (
        <div className="timeline">
          {groups.map(group => (
            <div key={group.key} className="timeline-group">
              <div className={`timeline-group-label${group.highlight ? ' is-highlight' : ''}`}>
                {group.label}
              </div>
              <ul className="timeline-list">
                {group.items.map((brief, index) => (
                  <li key={brief.slug} className="timeline-item">
                    <div className="timeline-rail">
                      <span className={`timeline-dot${group.highlight && index === 0 ? ' is-highlight' : ''}`} />
                    </div>
                    <Link href={`/briefs/${brief.slug}?from=past`} style={{ textDecoration: 'none' }}>
                      <div className="timeline-content">
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                          {brief.headline}
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '0.5rem' }}>
                          {brief.freeHtml.replace(/<[^>]*>/g, '').slice(0, 200)}…
                        </p>
                        <time style={{ fontSize: '0.85rem', color: '#666' }}>
                          {brief.publishDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'UTC',
                          })} UTC
                        </time>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No briefs published yet.</p>
      )}
    </PageLayout>
  );
}
