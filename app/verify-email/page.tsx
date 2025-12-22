'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [fallbackEmail, setFallbackEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async (email: string) => {
      try {
        const userCredential = await signInWithEmailLink(auth, email, window.location.href);
        // get ID token and create server session cookie
        const user = userCredential.user || auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          try {
            await fetch('/api/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken }),
            });
          } catch (err) {
            console.warn('Failed to create server session cookie:', err);
          }
        }

        window.localStorage.removeItem('emailForSignIn');
        setStatus('success');

        // Redirect to subscribe page after 2 seconds
        setTimeout(() => {
          router.push('/subscribe');
        }, 2000);
      } catch (err: any) {
        console.error('Verification error:', err);
        setStatus('error');
        setError(err.message || 'Failed to complete sign-in');
      }
    };

    const run = async () => {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        setStatus('error');
        setError('Invalid login link');
        return;
      }

      const storedEmail = window.localStorage.getItem('emailForSignIn');
      if (!storedEmail) {
        // show inline email input for users who cleared localStorage or used another device
        setShowEmailInput(true);
        return;
      }

      await verifyEmail(storedEmail);
    };

    run();
  }, [router]);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fallbackEmail) {
      setError('Please enter your email to continue');
      return;
    }
    setStatus('verifying');
    await (async () => {
      // reuse verification flow
      try {
        const userCredential = await signInWithEmailLink(auth, fallbackEmail, window.location.href);
        const user = userCredential.user || auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          try {
            await fetch('/api/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken }),
            });
          } catch (err) {
            console.warn('Failed to create server session cookie:', err);
          }
        }

        window.localStorage.removeItem('emailForSignIn');
        setStatus('success');
        setShowEmailInput(false);
        setTimeout(() => router.push('/subscribe'), 2000);
      } catch (err: any) {
        console.error('Verification error:', err);
        setStatus('error');
        setError(err.message || 'Failed to complete sign-in');
      }
    })();
  };

  return (
    <div className="container">
      <header>
        <h1 className="site-title">
          <Link href="/">Slow Brief</Link>
        </h1>
        <p className="tagline">What matters, without the feed.</p>
      </header>

      <main>
        <div style={{
          maxWidth: '500px',
          margin: '4rem auto',
          padding: '2rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          {status === 'verifying' && (
            <>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Verifying...</h2>
              <p style={{ color: '#666' }}>Please wait while we complete your sign-in.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0a0' }}>Success!</h2>
              <p style={{ marginBottom: '1rem' }}>You're now logged in.</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Redirecting to homepage...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#c33' }}>Error</h2>
              <p style={{ marginBottom: '1.5rem', color: '#c33' }}>{error}</p>
              <Link
                href="/login"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  background: '#222',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '4px',
                }}
              >
                Try Again
              </Link>
            </>
          )}
        </div>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Slow Brief. One brief per day.</p>
      </footer>
    </div>
  );
}
