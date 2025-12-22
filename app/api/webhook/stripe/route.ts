import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();

    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Handle subscription events
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await updateSubscriptionStatus(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await updateSubscriptionStatus(subscription);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const error = err as Error;
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: `Webhook Handler Error: ${error.message}` },
      { status: 500 }
    );
  }
}

async function updateSubscriptionStatus(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const usersSnapshot = await adminDb
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .get();

  if (usersSnapshot.empty) {
    console.log(`No user found for customer ${customerId}`);
    return;
  }

  // Update subscription status
  const status = subscription.status === 'active' ? 'active' : 'inactive';

  const updatePromises = usersSnapshot.docs.map((doc) =>
    doc.ref.update({
      subscriptionStatus: status,
      subscriptionId: subscription.id,
      updatedAt: new Date(),
    })
  );

  await Promise.all(updatePromises);
  console.log(`Updated subscription status to ${status} for customer ${customerId}`);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const userId = session.metadata?.userId;

  if (!userId) {
    console.log('No userId in checkout session metadata');
    return;
  }

  // Update or create user with Stripe customer ID
  await adminDb.collection('users').doc(userId).set(
    {
      email: session.customer_email,
      stripeCustomerId: customerId,
      subscriptionStatus: 'active',
      createdAt: new Date(),
    },
    { merge: true }
  );

  console.log(`Linked customer ${customerId} to user ${userId}`);
}
