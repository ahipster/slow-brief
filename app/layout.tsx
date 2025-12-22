import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://slowbrief.com'),
  title: 'Slow Brief - What matters, without the feed',
  description: 'One daily brief. Deliberate judgment over algorithmic feeds. Read less, understand more, feel calmer.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Slow Brief',
    description: 'What matters, without the feed.',
    url: 'https://slowbrief.com',
    siteName: 'Slow Brief',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
