import { Brief as BriefType } from '@/lib/briefs';
import Paywall from './Paywall';
import { BackLink } from './BackLink';
import { ReleaseCountdown } from './ReleaseCountdown';

interface BriefProps {
  brief: BriefType;
  showCountdown?: boolean;
}

export default function Brief({ brief, showCountdown = false }: BriefProps) {
  const publishedLabel = brief.publishDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <article>
      <div className="brief-meta">
        {showCountdown ? (
          <ReleaseCountdown />
        ) : (
          <BackLink href="/archive" label="Back" />
        )}
        <time dateTime={brief.publishDate.toISOString()}>{publishedLabel} UTC</time>
      </div>
      <h1>{brief.headline}</h1>

      <div
        className="free-section"
        dangerouslySetInnerHTML={{ __html: brief.freeHtml }}
      />

      <div className="section-divider">Full read</div>
      {brief.paidHtml ? (
        <div
          className="paid-section"
          dangerouslySetInnerHTML={{ __html: brief.paidHtml }}
        />
      ) : (
        <Paywall />
      )}
    </article>
  );
}
