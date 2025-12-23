'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BackLinkProps {
  href: string;
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(href);
    }
  };

  useEffect(() => {
    if (searchParams?.get('from') === 'past') {
      setVisible(true);
      return;
    }

    if (typeof document === 'undefined') {
      return;
    }

    try {
      const referrer = document.referrer;
      if (!referrer) {
        setVisible(false);
        return;
      }

      const refUrl = new URL(referrer);
      const currentUrl = new URL(window.location.href);
      const isSameOrigin = refUrl.origin === currentUrl.origin;
      const isFromPast = refUrl.pathname === '/archive' || refUrl.pathname.startsWith('/archive/');
      setVisible(isSameOrigin && isFromPast);
    } catch {
      setVisible(false);
    }
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="back-link"
      aria-label={`${label} to previous page`}
    >
      ← {label}
    </button>
  );
}
