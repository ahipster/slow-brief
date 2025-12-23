'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <header className="site-header">
      <div className="brand">
        <h1 className="site-title">
          <Link href="/">Slow Brief</Link>
        </h1>
        <p className="tagline">What matters, without the feed.</p>
      </div>
      <nav className="site-nav">
        <div className="nav-group">
          <Link href="/">Today</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/about">About</Link>
          <Link href="/manifesto">Manifesto</Link>
        </div>
        <span className="nav-divider" aria-hidden="true" />
        <div className="nav-group">
          <Link href="/subscribe">Subscribe</Link>
          {!loading && (
            <>
              {user ? (
                <>
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
                </>
              ) : (
                <Link href="/login">Log In</Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
