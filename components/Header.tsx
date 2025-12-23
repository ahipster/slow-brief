'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { ReleaseCountdown } from './ReleaseCountdown';

export function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  useEffect(() => {
    let active = true;

    const loadRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await fetch('/api/me');
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (active) {
          setIsAdmin(data.role === 'admin');
        }
      } catch (error) {
        if (active) {
          setIsAdmin(false);
        }
      }
    };

    loadRole();
    return () => {
      active = false;
    };
  }, [user]);

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
          <Link href="/">Now</Link>
          <Link href="/archive">Past</Link>
          <Link href="/manifesto">Manifesto</Link>
        </div>
        <span className="nav-divider" aria-hidden="true" />
        <div className="nav-group">
          <Link href="/subscribe">Subscribe</Link>
          {!loading && (
            <>
              {user ? (
                <>
                  {isAdmin && <Link href="/account">Admin</Link>}
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
