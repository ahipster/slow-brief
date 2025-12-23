'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { PageLayout } from '@/components/PageLayout';

interface SubscriptionInfo {
  hasSubscription: boolean;
  loading: boolean;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    hasSubscription: false,
    loading: true,
  });
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      // Check subscription status
      fetch('/api/subscription-status')
        .then(res => res.json())
        .then(data => {
          setSubscription({
            hasSubscription: data.hasSubscription || false,
            loading: false,
          });
        })
        .catch(() => {
          setSubscription({ hasSubscription: false, loading: false });
        });
    }
  }, [user, authLoading, router]);

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

  if (authLoading || subscription.loading) {
    return (
      <PageLayout>
        <h1>Account</h1>
        <p>Loading...</p>
      </PageLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <h1>Account</h1>

      <section style={{ marginBottom: '3rem' }}>
        <div style={{
          padding: '2rem',
          background: '#fafafa',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Email</h2>
          <p style={{ color: '#666' }}>{user.email}</p>
        </div>

        <div style={{
          padding: '2rem',
          background: '#fafafa',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Subscription Status</h2>
          {subscription.hasSubscription ? (
            <>
              <p style={{
                color: '#16a34a',
                fontWeight: 500,
                marginBottom: '1.5rem',
              }}>
                ✓ Active Subscriber
              </p>
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                style={{
                  padding: '0.875rem 1.75rem',
                  background: '#1a1a1a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  cursor: portalLoading ? 'not-allowed' : 'pointer',
                  opacity: portalLoading ? 0.6 : 1,
                }}
              >
                {portalLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
              <p style={{
                fontSize: '0.85rem',
                color: '#666',
                marginTop: '1rem',
              }}>
                Manage your billing, update payment methods, or cancel your subscription
              </p>
            </>
          ) : (
            <>
              <p style={{
                color: '#dc2626',
                fontWeight: 500,
                marginBottom: '1.5rem',
              }}>
                No active subscription
              </p>
              <a
                href="/subscribe"
                style={{
                  display: 'inline-block',
                  padding: '0.875rem 1.75rem',
                  background: '#1a1a1a',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }}
              >
                Subscribe Now
              </a>
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
