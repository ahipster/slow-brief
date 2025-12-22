import Link from 'next/link';
import SubscribeCTA from './SubscribeCTA';

export default function Paywall() {
  return (
    <div className="paywall">
      <p className="paywall-message">
        The rest of today&apos;s brief is for subscribers.
      </p>
      <SubscribeCTA />
    </div>
  );
}
