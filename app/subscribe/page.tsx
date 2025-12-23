'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { PageLayout } from '@/components/PageLayout';

export default function SubscribePage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetch('/api/subscription-status')
        .then(res => res.json())
        .then(data => {
          setHasSubscription(data.hasSubscription || false);
          setCheckingSubscription(false);
        })
        .catch(() => {
          setCheckingSubscription(false);
        });
    } else {
      setCheckingSubscription(false);
    }
  }, [user]);

  const handleSubscribe = async (priceId: 'monthly' | 'annual') => {
    if (!user) {
      alert('Please log in first to subscribe');
      return;
    }

    setLoading(priceId);
    try {
      const formData = new FormData();
      formData.append('priceId', priceId);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert(`Error: ${data.error || 'Failed to start checkout'}`);
        setLoading(null);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch('/api/customer-portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(`Error: ${data.error || 'Failed to open customer portal'}`);
        setPortalLoading(false);
      }
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      alert('Failed to open customer portal. Please try again.');
      setPortalLoading(false);
    }
  };
  return (
    <PageLayout>
      <section style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
          Deeper context, deliberate judgment, calm clarity and slow reads.
        </p>

        {!authLoading && !checkingSubscription && user && hasSubscription && (
          <div style={{
            maxWidth: '520px',
            margin: '0 auto 2rem',
            padding: '1.75rem',
            background: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}>
            <p style={{ marginBottom: '0.75rem', color: '#16a34a', fontWeight: 500 }}>
              ✓ Active subscriber
            </p>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#666' }}>
              Signed in as {user.email}
            </p>
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.95rem',
                cursor: portalLoading ? 'not-allowed' : 'pointer',
                opacity: portalLoading ? 0.6 : 1,
              }}
            >
              {portalLoading ? 'Loading...' : 'Manage Subscription'}
            </button>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.75rem' }}>
              Update billing, payment methods, or cancel.
            </p>
          </div>
        )}

        {!authLoading && !user && (
          <div style={{
            maxWidth: '520px',
            margin: '0 auto 2rem',
            padding: '1.5rem',
            background: '#fffbf0',
            border: '1px solid #ffd966',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Please log in first</strong>
            </p>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#666' }}>
              You need to be logged in to subscribe
            </p>
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
              Log In
            </Link>
          </div>
        )}

        {!hasSubscription && (
          <>
            <div className="section-divider">Plans</div>
            <div className="plan-grid">
              <div style={{
                border: '1px solid #ddd',
                padding: '2rem',
                borderRadius: '8px',
              }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Monthly</h2>
                <p style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem' }}>€5 <span style={{ fontSize: '1rem', fontWeight: 400 }}>/month</span></p>
                <button
                  onClick={() => handleSubscribe('monthly')}
                  disabled={!user || loading !== null}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#fff',
                    color: '#222',
                    border: '1px solid #222',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    cursor: !user || loading ? 'not-allowed' : 'pointer',
                    opacity: !user || loading ? 0.6 : 1,
                  }}
                >
                  {loading === 'monthly' ? 'Processing...' : 'Subscribe Monthly'}
                </button>
              </div>

              <div style={{
                border: '2px solid #222',
                padding: '2rem',
                borderRadius: '8px',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#222',
                  color: '#fff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  RECOMMENDED
                </div>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Annual</h2>
                <p style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.25rem' }}>€50 <span style={{ fontSize: '1rem', fontWeight: 400 }}>/year</span></p>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Save €10</p>
                <button
                  onClick={() => handleSubscribe('annual')}
                  disabled={!user || loading !== null}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#222',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    cursor: !user || loading ? 'not-allowed' : 'pointer',
                    opacity: !user || loading ? 0.6 : 1,
                  }}
                >
                  {loading === 'annual' ? 'Processing...' : 'Subscribe Annually'}
                </button>
              </div>
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          <p>One plan. No tiers. No trials.</p>
        </div>
      </section>
    </PageLayout>
  );
}
