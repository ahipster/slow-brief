# Slow Brief

**What matters, without the feed.**

Slow Brief is a daily editorial companion that replaces algorithmic feeds with a single, deliberate act of judgment. Each day, exactly one item is chosen and framed calmly, with enough context to understand why it matters — and with restraint about what does not.

## Core Promise

If you read Slow Brief each day:
- You read **less**
- You understand **more**
- You feel **calmer**
- You stop scrolling

**Scarcity is the product.**

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Hosting**: Firebase App Hosting
- **Database**: Firestore
- **Authentication**: Firebase Auth (magic link)
- **Payments**: Stripe (€5/month or €50/year)
- **Server-Side Rendering**: SSR for paywall enforcement

## Project Structure

```
slow-brief/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage (today's brief)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── archive/page.tsx          # Chronological list
│   ├── briefs/[slug]/page.tsx    # Individual brief (SSR paywall)
│   ├── about/page.tsx            # What Slow Brief is/isn't
│   ├── subscribe/page.tsx        # Subscription page
│   ├── manifesto/page.tsx        # Editorial constitution
│   └── api/checkout/route.ts     # Stripe checkout API
├── components/
│   ├── Brief.tsx                 # Brief display component
│   ├── Paywall.tsx               # Paywall UI
│   └── SubscribeCTA.tsx          # Subscribe button
├── lib/
│   ├── firebase-admin.ts         # Admin SDK (server-side)
│   ├── firebase-client.ts        # Client SDK
│   ├── auth.ts                   # Auth helpers
│   └── briefs.ts                 # Brief fetching with paywall logic
├── functions/
│   └── stripe-webhook.ts         # Stripe → Firestore sync
├── public/
│   └── robots.txt                # SEO
├── CLAUDE.md                     # AI assistant guide
├── firestore.rules               # Security rules (critical!)
├── firebase.json                 # Firebase configuration
├── next.config.js                # Next.js configuration
└── package.json                  # Dependencies
```

## Implementation Status

### ✅ Completed

**Core Infrastructure:**
- [x] Next.js 14 project with TypeScript and App Router
- [x] Project structure (app/, components/, lib/, functions/)
- [x] Firebase Admin SDK configuration
- [x] Firebase Client SDK configuration

**Security & Data:**
- [x] Firestore security rules (paywall enforcement)
- [x] Authentication helpers (magic link email)
- [x] Brief fetching logic with server-side paywall

**UI Components:**
- [x] Brief component (headline, free/paid sections)
- [x] Paywall component
- [x] SubscribeCTA component

**Pages (All 6 Required Pages):**
- [x] Homepage (/) - Today's brief
- [x] Archive (/archive) - Chronological list
- [x] Individual brief (/briefs/[slug]) - SSR paywall
- [x] About (/about) - What Slow Brief is/isn't
- [x] Subscribe (/subscribe) - €5/month, €50/year
- [x] Manifesto (/manifesto) - Editorial constitution

**Payment Integration:**
- [x] Stripe checkout session creation
- [x] Stripe webhook (subscription sync to Firestore)

**Configuration:**
- [x] Environment variables (.env.example)
- [x] next.config.js (Firebase App Hosting settings)
- [x] firebase.json (hosting, functions, Firestore rules)
- [x] SEO basics (robots.txt, meta tags, semantic HTML)
- [x] Mobile-first responsive design

### 🔄 Next Steps (Testing & Deployment)

1. **Local Testing**
   - Set up environment variables (.env.local)
   - Test paywall integrity (paid content never sent to client)
   - Test authentication flow (magic link)
   - Test Stripe checkout and webhook

2. **Firebase Setup**
   - Initialize Firebase project
   - Deploy Firestore security rules
   - Deploy Cloud Functions
   - Configure Stripe webhook endpoint

3. **Production Deployment**
   - Deploy to Firebase App Hosting
   - Configure custom domain (slowbrief.com)
   - Set production environment variables

## Getting Started

### Prerequisites

- Node.js 20+
- Firebase CLI
- Stripe account
- Firebase project with billing enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ahipster/slow-brief.git
   cd slow-brief
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure environment variables in `.env.local`:
   - Firebase configuration (from Firebase Console)
   - Stripe keys (from Stripe Dashboard)
   - Stripe price IDs for monthly and annual plans

5. Run development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Firebase Setup

1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Initialize Firebase (select existing project):
   ```bash
   firebase init
   ```
   - Select: Firestore, Functions, Hosting
   - Use existing project: `slow-brief`

3. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. Deploy Cloud Functions:
   ```bash
   firebase deploy --only functions
   ```

5. Deploy hosting:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### Stripe Setup

1. Create two subscription products in Stripe Dashboard:
   - **Monthly**: €5/month
   - **Annual**: €50/year

2. Copy the price IDs to environment variables:
   ```
   STRIPE_MONTHLY_PRICE_ID=price_xxx
   STRIPE_ANNUAL_PRICE_ID=price_xxx
   ```

3. Set up webhook endpoint:
   - URL: `https://slowbrief.com/api/webhook/stripe`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `checkout.session.completed`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Critical Security Features

### Server-Side Paywall

The paywall is enforced **server-side only**:

1. **Firestore Security Rules** (`firestore.rules`)
   - Client can only read: `headline`, `freeHtml`, `publishDate`, `slug`, `status`
   - `paidHtml` field is **denied** to all client reads

2. **Server-Side Brief Fetching** (`lib/briefs.ts`)
   - Briefs fetched using Firebase Admin SDK (server-side)
   - `paidHtml` only included if user has active subscription
   - Subscription status verified server-side via Firestore

3. **SSR Page Rendering** (`app/briefs/[slug]/page.tsx`)
   - Brief content rendered server-side
   - Paid content never sent to client for non-subscribers
   - No blur tricks, no client-side gating

### Testing Paywall Integrity

To verify the paywall works correctly:

1. **Client-Side Check**:
   - Open browser DevTools → Network tab
   - Load a brief page as non-subscriber
   - Inspect Firestore requests
   - Verify `paidHtml` field is NOT present in response

2. **Server-Side Check**:
   - Check server logs for brief fetching
   - Verify subscription status is checked
   - Confirm paid content only included for active subscribers

## Firestore Data Structure

### briefs/ Collection

```typescript
{
  slug: string,
  headline: string,
  freeHtml: string,          // 120-180 words, public
  paidHtml: string,          // Full context, subscribers only
  publishDate: Timestamp,
  status: 'draft' | 'published'
}
```

### users/ Collection

```typescript
{
  email: string,
  subscriptionStatus: 'active' | 'inactive',
  stripeCustomerId: string,
  subscriptionId: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Editorial Principles

From `CLAUDE.md` - these govern all development decisions:

> **Slow Brief exists to reduce noise, not add to it.**
>
> We publish one brief per day.
> We choose deliberately.
> We omit aggressively.
>
> We do not chase trends, outrage, or virality.
> We do not optimize for engagement.
> We do not personalize attention.
>
> We believe judgment matters more than volume.
> We believe understanding takes time.

### What to NEVER Add

- Multiple posts per day
- Categories or tags
- Related stories / infinite scroll
- Personalization
- Comments or social features
- AI-generated prose
- Multiple subscription tiers
- Free trial period

**If a feature increases volume, attention, or complexity: say no.**

## License

Private - All rights reserved

## Contact

For questions about Slow Brief, contact: [contact@slowbrief.com]

---

**One brief per day. Always.**
