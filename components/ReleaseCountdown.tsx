'use client';

import { useEffect, useState } from 'react';

function getNextReleaseTime(now: Date) {
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDate = now.getUTCDate();
  const utcHour = now.getUTCHours();

  const nextSlotHour = (Math.floor(utcHour / 4) + 1) * 4;
  if (nextSlotHour >= 24) {
    return new Date(Date.UTC(utcYear, utcMonth, utcDate + 1, 0, 0, 0));
  }

  return new Date(Date.UTC(utcYear, utcMonth, utcDate, nextSlotHour, 0, 0));
}

function formatCountdown(msRemaining: number) {
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function ReleaseCountdown() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nextRelease = getNextReleaseTime(now);
      setLabel(formatCountdown(nextRelease.getTime() - now.getTime()));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown-bar">
      <span>Refresh</span>
      <span className="countdown-time" suppressHydrationWarning>
        {label ?? '--:--:--'}
      </span>
    </div>
  );
}
