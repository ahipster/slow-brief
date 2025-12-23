import { Brief as BriefType } from '@/lib/briefs';
import Paywall from './Paywall';

interface BriefProps {
  brief: BriefType;
}

export default function Brief({ brief }: BriefProps) {
  return (
    <article>
      <h1>{brief.headline}</h1>

      <div
        className="free-section"
        dangerouslySetInnerHTML={{ __html: brief.freeHtml }}
      />

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
