'use client';

import Link from 'next/link';
import { useState } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      // Save email to localStorage to complete sign-in
      window.localStorage.setItem('emailForSignIn', email);

      setSent(true);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to send login link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
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
        </nav>
      </header>

      <main>
        <h1>Log In</h1>

        {sent ? (
          <div style={{
            maxWidth: '500px',
            margin: '2rem auto',
            padding: '2rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Check your email</h2>
            <p style={{ marginBottom: '1rem' }}>
              We sent a login link to <strong>{email}</strong>
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Click the link in the email to complete sign-in. You can close this page.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{
            maxWidth: '400px',
            margin: '2rem auto',
          }}>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', color: '#666' }}>
              Enter your email to receive a login link. No password required.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
              }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                background: '#fee',
                border: '1px solid #fcc',
                borderRadius: '4px',
                color: '#c33',
                fontSize: '0.9rem',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: loading || !email ? 'not-allowed' : 'pointer',
                opacity: loading || !email ? 0.6 : 1,
              }}
            >
              {loading ? 'Sending...' : 'Send Login Link'}
            </button>
          </form>
        )}
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Slow Brief. One brief per day.</p>
      </footer>
    </div>
  );
}
