import { Metadata } from 'next';
import { getTodaysBrief } from '@/lib/briefs';
import Brief from '@/components/Brief';
import { PageLayout } from '@/components/PageLayout';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Slow Brief - What matters, without the feed',
  description: 'One daily brief. Deliberate judgment over algorithmic feeds. Read less, understand more, feel calmer.',
};

export default async function HomePage() {
  const brief = await getTodaysBrief();

  return (
    <PageLayout>
      {brief ? (
        <Brief brief={brief} />
      ) : (
        <p>No brief published today. Check back tomorrow.</p>
      )}
    </PageLayout>
  );
}
