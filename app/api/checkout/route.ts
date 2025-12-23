import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCurrentUser } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Price IDs for the subscription plans
const PRICE_IDS = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID!,
  annual: process.env.STRIPE_ANNUAL_PRICE_ID!,
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const priceId = formData.get('priceId') as 'monthly' | 'annual';

    console.log('Checkout request received:', { priceId });
    console.log('Price IDs configured:', PRICE_IDS);

    if (!priceId || !PRICE_IDS[priceId]) {
      console.error('Invalid price ID:', priceId);
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Get current user (optional - can subscribe without account)
    const user = await getCurrentUser();
    const customerEmail = user?.email;

    console.log('Creating Stripe session for:', { priceId, customerEmail });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[priceId],
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/subscribe`,
      customer_email: customerEmail,
      metadata: {
        userId: user?.uid || '',
      },
    });

    console.log('Stripe session created:', session.id);

    // Return the session URL in the response
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
