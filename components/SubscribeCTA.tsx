import Link from 'next/link';

export default function SubscribeCTA() {
  return (
    <div className="subscribe-cta">
      <Link href="/subscribe" className="subscribe-button">
        Subscribe
      </Link>
    </div>
  );
}
