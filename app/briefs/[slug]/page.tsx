import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBriefBySlug } from '@/lib/briefs';
import Brief from '@/components/Brief';
import { PageLayout } from '@/components/PageLayout';

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
    <PageLayout>
      <Brief brief={brief} />
    </PageLayout>
  );
}
