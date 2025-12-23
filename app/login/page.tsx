'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { PageLayout } from '@/components/PageLayout';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<string | null>(null);
  const [emailPasswordLoading, setEmailPasswordLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState<'password' | 'magic'>('magic');

  const createSession = async () => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    const idToken = await user.getIdToken();
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  };

  const handleProviderLogin = async (provider: GoogleAuthProvider, name: string) => {
    setProviderLoading(name);
    setError('');
    try {
      await signInWithPopup(auth, provider);
      await createSession();
      router.push('/subscribe');
    } catch (err: any) {
      console.error('Provider login error:', err);
      setError(err.message || `Failed to sign in with ${name}`);
    } finally {
      setProviderLoading(null);
    }
  };

  const handleMagicLink = async () => {
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

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailPasswordLoading(true);
    setError('');

    try {
      if (isCreating) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      await createSession();
      router.push('/subscribe');
    } catch (err: any) {
      console.error('Email/password login error:', err);
      setError(err.message || 'Failed to sign in with email and password');
    } finally {
      setEmailPasswordLoading(false);
    }
  };

  return (
    <PageLayout>
      {error && (
        <div style={{
          padding: '0.75rem',
          margin: '1.5rem auto',
          maxWidth: '420px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33',
          fontSize: '0.9rem',
        }}>
          {error}
        </div>
      )}

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
        <>
          <div style={{
            display: 'grid',
            gap: '0.75rem',
            maxWidth: '420px',
            margin: '1.5rem auto 2rem',
          }}>
            <button
              type="button"
              onClick={() => handleProviderLogin(new GoogleAuthProvider(), 'Google')}
              disabled={providerLoading !== null || loading || emailPasswordLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#fff',
                color: '#222',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.95rem',
                cursor: providerLoading || loading || emailPasswordLoading ? 'not-allowed' : 'pointer',
                opacity: providerLoading || loading || emailPasswordLoading ? 0.6 : 1,
              }}
            >
              {providerLoading === 'Google' ? 'Connecting...' : 'Continue with Google'}
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '1.5rem auto',
            maxWidth: '420px',
            color: '#999',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            <span style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
            Email sign-in
            <span style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
          </div>

          <div style={{
            maxWidth: '400px',
            margin: '2rem auto',
          }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}>
              <button
                type="button"
                onClick={() => setAuthMode('password')}
                disabled={loading || emailPasswordLoading || providerLoading !== null}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.75rem',
                  background: authMode === 'password' ? '#222' : '#fff',
                  color: authMode === 'password' ? '#fff' : '#222',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  cursor: loading || emailPasswordLoading || providerLoading !== null ? 'not-allowed' : 'pointer',
                  opacity: loading || emailPasswordLoading || providerLoading !== null ? 0.6 : 1,
                }}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('magic')}
                disabled={loading || emailPasswordLoading || providerLoading !== null}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.75rem',
                  background: authMode === 'magic' ? '#222' : '#fff',
                  color: authMode === 'magic' ? '#fff' : '#222',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  cursor: loading || emailPasswordLoading || providerLoading !== null ? 'not-allowed' : 'pointer',
                  opacity: loading || emailPasswordLoading || providerLoading !== null ? 0.6 : 1,
                }}
              >
                Email link
              </button>
            </div>

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
                disabled={loading || emailPasswordLoading || providerLoading !== null}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
            </div>

            {authMode === 'password' ? (
              <form onSubmit={handleEmailPasswordLogin}>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="password" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem',
                  }}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={emailPasswordLoading || loading || providerLoading !== null}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                    }}
                  />
                </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={isCreating}
                  onChange={(e) => setIsCreating(e.target.checked)}
                  disabled={emailPasswordLoading || loading || providerLoading !== null}
                />
                Create a new account
              </label>

              <button
                type="submit"
                disabled={emailPasswordLoading || !email || !password || loading || providerLoading !== null}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  cursor: emailPasswordLoading || !email || !password || loading || providerLoading !== null ? 'not-allowed' : 'pointer',
                  opacity: emailPasswordLoading || !email || !password || loading || providerLoading !== null ? 0.6 : 1,
                }}
              >
                  {emailPasswordLoading ? 'Signing in...' : (isCreating ? 'Create Account' : 'Sign In')}
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={handleMagicLink}
                disabled={loading || !email || emailPasswordLoading || providerLoading !== null}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#fff',
                  color: '#222',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  cursor: loading || !email || emailPasswordLoading || providerLoading !== null ? 'not-allowed' : 'pointer',
                  opacity: loading || !email || emailPasswordLoading || providerLoading !== null ? 0.6 : 1,
                }}
              >
                {loading ? 'Sending...' : 'Email me a login link'}
              </button>
            )}
          </div>
        </>
      )}
    </PageLayout>
  );
}
