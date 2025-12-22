'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export function Header() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await signOut();
    }
  };

  return (
    <header>
      <h1 className="site-title">
        <Link href="/">Slow Brief</Link>
      </h1>
      <p className="tagline">What matters, without the feed.</p>
      <nav>
        <Link href="/archive">Archive</Link>
        <Link href="/about">About</Link>
        <Link href="/manifesto">Manifesto</Link>
        <Link href="/subscribe">Subscribe</Link>
        {!loading && (
          <>
            {user ? (
              <button
                onClick={handleSignOut}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Log Out
              </button>
            ) : (
              <Link href="/login">Log In</Link>
            )}
          </>
        )}
      </nav>
    </header>
  );
}
