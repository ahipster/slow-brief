# Slow Brief - Technical Specification

**Version:** 1.0
**Last Updated:** December 23, 2025

---

## Product Vision

Slow Brief is a daily editorial platform that replaces algorithmic feeds with deliberate judgment.

### Core Promise

- Read **less**
- Understand **more**
- Feel **calmer**
- Stop scrolling

**Scarcity is the product.**

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Hosting | Vercel |
| Database | Cloud Firestore |
| Authentication | Firebase Auth (passwordless magic link) |
| Payments | Stripe (Subscriptions) |
| Rendering | Server-Side Rendering (SSR) |
| Styling | CSS (no framework) |

---

## Architecture

### Security Model

**Critical**: Paywall is enforced server-side only. Paid content never sent to non-subscribers.

```
Client Request → Next.js SSR → Firebase Admin SDK → Firestore
                     ↓
           Check Subscription Status
                     ↓
         Include paidHtml only if subscribed
                     ↓
           Render HTML server-side
                     ↓
          Send to client (no paid content leaks)
```

### Data Flow

1. **Brief Fetching**: Admin SDK queries Firestore server-side
2. **Auth Check**: Server validates session cookie
3. **Subscription Check**: Server queries user document in Firestore
4. **Conditional Rendering**: `paidHtml` included only for active subscribers
5. **SSR Output**: HTML rendered server-side, sent to client

---

## Database Schema

### Collection: `briefs`

```typescript
interface Brief {
  slug: string;                    // URL-friendly identifier (e.g., "ai-mediation-judgment")
  headline: string;                // Brief title
  freeHtml: string;                // Public preview (120-180 words)
  paidHtml: string;                // Full content (subscribers only)
  publishDate: Timestamp;          // Publication date/time
  status: 'draft' | 'published';   // Publication status
}
```

**Firestore Rules:**
- Clients can read: `slug`, `headline`, `freeHtml`, `publishDate`, `status`
- Clients **cannot** read: `paidHtml` (enforced by security rules)
- Only admins can write

### Collection: `users`

```typescript
interface User {
  email: string;                   // User email
  subscriptionStatus: 'active' | 'inactive';
  stripeCustomerId: string;        // Stripe customer ID
  subscriptionId?: string;         // Current subscription ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Firestore Rules:**
- Only admins can read/write

---

## Pages & Routes

### 1. Homepage `/`
- **Purpose**: Display today's published brief
- **SSR**: Yes
- **Auth Required**: No
- **Content**: Free section for all, paid section for subscribers only
- **Query**: `WHERE status == 'published' AND publishDate >= today AND publishDate < tomorrow`

### 2. Archive `/archive`
- **Purpose**: Chronological list of all published briefs
- **SSR**: Yes
- **Auth Required**: No
- **Content**: Title + date only (no content preview)
- **Query**: `WHERE status == 'published' ORDER BY publishDate DESC`

### 3. Brief Detail `/briefs/[slug]`
- **Purpose**: Individual brief page
- **SSR**: Yes (critical for paywall)
- **Auth Required**: No (but paywall enforced)
- **Content**: Free section for all, paid section for subscribers
- **Query**: `WHERE slug == [slug] AND status == 'published'`

### 4. Manifesto `/manifesto`
- **Purpose**: Editorial philosophy and principles, plus what Slow Brief is/is not
- **SSR**: No (static)
- **Auth Required**: No

### 5. Subscribe `/subscribe`
- **Purpose**: Subscription options and Stripe checkout
- **SSR**: No (client-side)
- **Auth Required**: No (but must be logged in to subscribe)
- **Features**:
  - Shows "Already subscribed" banner if user has active subscription
  - Hides subscription buttons if already subscribed
  - Monthly: €5/month
  - Annual: €50/year (recommended)

### 6. Login `/login`
- **Purpose**: Passwordless email login
- **SSR**: No
- **Features**:
  - Email input field
  - Sends magic link to email
  - No password required

### 8. Verify Email `/verify-email`
- **Purpose**: Magic link landing page
- **SSR**: No
- **Features**:
  - Validates email sign-in link
  - Creates session cookie
  - Redirects to homepage

### 9. Account `/account`
- **Purpose**: Manage subscription and account
- **SSR**: No
- **Auth Required**: Yes (redirects to login if not authenticated)
- **Features**:
  - Show user email
  - Show subscription status
  - "Manage Subscription" button → Stripe Customer Portal
  - "Subscribe Now" button (if no subscription)

---

## API Routes

### POST `/api/checkout`
- **Purpose**: Create Stripe Checkout session
- **Auth Required**: Yes
- **Input**: `FormData` with `priceId` (monthly or annual)
- **Output**: `{ url: string }` (Stripe Checkout URL)
- **Flow**:
  1. Verify user is authenticated
  2. Create Stripe Checkout session
  3. Set success/cancel URLs
  4. Return Checkout URL

### POST `/api/webhook/stripe`
- **Purpose**: Handle Stripe webhook events
- **Auth Required**: No (webhook signature verified)
- **Events Handled**:
  - `checkout.session.completed`: Create/update user in Firestore
  - `customer.subscription.created`: Set subscription status to active
  - `customer.subscription.updated`: Update subscription status
  - `customer.subscription.deleted`: Set subscription status to inactive
- **Security**: Stripe webhook signature verification required

### POST `/api/customer-portal`
- **Purpose**: Create Stripe Customer Portal session
- **Auth Required**: Yes
- **Output**: `{ url: string }` (Stripe portal URL)
- **Use**: Allow subscribers to manage subscription, update payment, cancel

### GET `/api/subscription-status`
- **Purpose**: Check if current user has active subscription
- **Auth Required**: Yes
- **Output**: `{ hasSubscription: boolean }`

### POST `/api/session`
- **Purpose**: Create Firebase session cookie after email verification
- **Auth Required**: No (ID token provided)
- **Input**: `{ idToken: string }`
- **Output**: Session cookie set

---

## Authentication Flow

### Login Process

1. User enters email on `/login`
2. Call `sendMagicLink(email, redirectUrl)`
3. Firebase sends email with sign-in link
4. User clicks link → redirects to `/verify-email?...`
5. Verify sign-in link with Firebase Client SDK
6. Get ID token from Firebase
7. POST to `/api/session` with ID token
8. Server creates session cookie (HttpOnly, Secure)
9. Redirect to homepage (now authenticated)

### Session Management

- **Storage**: HttpOnly, Secure session cookie
- **Duration**: 14 days
- **Validation**: Server-side via `getCurrentUser()` helper
- **Logout**: Clear session cookie

---

## Payment Flow

### Subscription Process

1. User clicks "Subscribe Monthly" or "Subscribe Annually"
2. POST to `/api/checkout` with `priceId`
3. Server creates Stripe Checkout session
4. Redirect to Stripe Checkout
5. User enters payment information
6. Stripe processes payment
7. Stripe sends webhook to `/api/webhook/stripe`
8. Webhook handler:
   - Verifies signature
   - Creates/updates user in Firestore
   - Sets `subscriptionStatus: 'active'`
   - Sets `stripeCustomerId`
9. Stripe redirects back to site
10. User now has access to paid content

### Subscription Management

1. User goes to `/account`
2. Clicks "Manage Subscription"
3. POST to `/api/customer-portal`
4. Server creates Stripe Customer Portal session
5. Redirect to Stripe portal
6. User can:
   - Update payment method
   - Cancel subscription
   - View invoices
7. Any changes trigger webhooks → Firestore updated

---

## Styling & Design

### Principles

- **Minimal**: No CSS framework, plain CSS only
- **Typography-focused**: Clean, readable, generous spacing
- **Mobile-first**: Responsive design from smallest screens up
- **Calm**: No animations, no tricks, no distractions
- **Fast**: No unnecessary assets or dependencies

### Colors

```css
--text-primary: #1a1a1a
--text-secondary: #666
--background: #fafafa
--container-bg: #fff
--border: #ddd
--link: #222
--button-bg: #1a1a1a
--button-text: #fff
```

### Typography

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
font-size: 18px
line-height: 1.7
```

### Layout

```css
.container {
  max-width: 640px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  background: #fff;
  min-height: 100vh;
}
```

### Responsive Breakpoints

- **Mobile**: < 640px
- **Desktop**: ≥ 640px

---

## Content Guidelines

### Brief Structure

**Headline:**
- Plain language, clear and specific
- No clickbait, no questions, no exclamation marks
- Examples:
  - "We are quietly normalizing AI mediation of judgment"
  - "Collective memory vs algorithmic feed"

**Free Section (120-180 words):**
- Public, SEO-indexed
- Establishes credibility
- Provides enough context to understand importance
- One primary source link
- Ends with: "The rest of today's brief is for subscribers."

**Paid Section (subscribers only):**
- Deeper context (historical, structural, conceptual)
- "What to ignore today" section (optional)
- One slower piece (essay, long read, cultural artifact)
- No fluff, every sentence earns its place

---

## Editorial Principles

### The Constitution

> Slow Brief exists to reduce noise, not add to it.
>
> We choose deliberately.
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
- Related stories
- Personalization
- Comments or social features
- AI-generated prose
- Real-time updates
- Trending sections
- Share counts or metrics
- Multiple subscription tiers
- Free trial period

**Rule**: If a feature increases volume, attention, or complexity → say no.

---

## Environment Variables

### Required (Production)

```bash
# Firebase (Client - Public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase (Server - Secret)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Stripe (Production - Secret)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_ANNUAL_PRICE_ID=price_...

# Optional
NEXT_PUBLIC_BASE_URL=https://slowbrief.com
```

---

## Security Checklist

- [ ] Firestore rules deny client access to `paidHtml`
- [ ] Admin SDK used for all server-side Firestore queries
- [ ] Session cookies are HttpOnly and Secure
- [ ] Stripe webhook signatures verified
- [ ] Environment variables never committed to git
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] No paid content in client-side bundles
- [ ] Brief rendering happens server-side only

---

## Performance Requirements

### Build Output

- **Total JS (First Load)**: < 150 KB
- **Page Load Time**: < 2s on 3G
- **Lighthouse Score**: > 90

### Optimization

- Server-side rendering for paywall pages
- Static generation for public pages (Manifesto)
- Minimal JavaScript (auth and Stripe only)
- No images in critical path
- No third-party analytics

---

## Deployment Requirements

### Platform: Vercel

**Why Vercel:**
- Built for Next.js SSR
- Edge functions for API routes
- Automatic HTTPS
- Zero config deployments
- Environment variable management

### CI/CD

- **Push to main** → automatic deployment
- **Environment variables** set in Vercel Dashboard
- **Custom domain** configured through Vercel

### Stripe Webhook Configuration

**Production Webhook URL:**
```
https://slowbrief.com/api/webhook/stripe
```

**Events to subscribe:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

## Testing Strategy

### Manual Testing Checklist

**Authentication:**
- [ ] Magic link email received
- [ ] Sign-in link works
- [ ] Session persists across page refreshes
- [ ] Logout clears session

**Paywall:**
- [ ] Non-subscribers see free section only
- [ ] Subscribers see full content
- [ ] Paid content NOT in browser network requests for non-subscribers
- [ ] Paid content NOT in HTML source for non-subscribers

**Subscription:**
- [ ] Stripe Checkout loads
- [ ] Payment processes successfully
- [ ] Webhook updates Firestore
- [ ] User gains access after payment
- [ ] "Already subscribed" message shows for active subscribers

**Account Management:**
- [ ] Subscription status displays correctly
- [ ] Stripe Customer Portal loads
- [ ] Cancellation works
- [ ] Firestore updates after cancellation

---

## File Structure

```
slow-brief/
├── app/
│   ├── layout.tsx              # Root layout with auth provider
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Homepage (today's brief)
│   ├── account/page.tsx        # Account management
│   ├── archive/page.tsx        # Archive listing
│   ├── briefs/[slug]/page.tsx  # Individual brief (SSR)
│   ├── login/page.tsx          # Login form
│   ├── manifesto/page.tsx      # Editorial manifesto
│   ├── subscribe/page.tsx      # Subscription page
│   ├── verify-email/page.tsx   # Magic link handler
│   └── api/
│       ├── checkout/route.ts   # Stripe checkout
│       ├── customer-portal/route.ts  # Stripe portal
│       ├── session/route.ts    # Session cookie creation
│       ├── subscription-status/route.ts  # Check subscription
│       └── webhook/stripe/route.ts  # Stripe webhooks
├── components/
│   ├── AuthProvider.tsx        # Firebase auth context
│   ├── Brief.tsx               # Brief display component
│   ├── Header.tsx              # Navigation header
│   ├── PageLayout.tsx          # Page wrapper with header/footer
│   ├── Paywall.tsx             # Paywall UI
│   └── SubscribeCTA.tsx        # Subscribe button
├── lib/
│   ├── auth.ts                 # Auth helpers (magic link, session)
│   ├── briefs.ts               # Brief fetching with paywall logic
│   ├── firebase-admin.ts       # Firebase Admin SDK setup
│   └── firebase-client.ts      # Firebase Client SDK setup
├── public/
│   ├── favicon.svg             # Favicon
│   └── robots.txt              # SEO crawl directives
├── firestore.rules             # Firestore security rules
├── firebase.json               # Firebase configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
└── .env.local                  # Environment variables (gitignored)
```

---

## Dependencies

### Production

```json
{
  "next": "^14.2.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "firebase": "^10.0.0",
  "firebase-admin": "^12.0.0",
  "stripe": "^14.0.0"
}
```

### Development

```json
{
  "@types/node": "^20.0.0",
  "@types/react": "^18.0.0",
  "typescript": "^5.0.0",
  "eslint": "^8.0.0",
  "eslint-config-next": "^14.0.0"
}
```

**Philosophy**: Keep dependencies minimal. No utility libraries for one-off operations.

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Set up Firebase project (Firestore + Auth)
- [ ] Configure Stripe account with products
- [ ] Create Firestore security rules
- [ ] Set up environment variables

### Phase 2: Core Features
- [ ] Implement authentication (magic link)
- [ ] Build brief fetching logic (server-side paywall)
- [ ] Create all 6 pages
- [ ] Implement Stripe checkout
- [ ] Set up Stripe webhooks

### Phase 3: Polish
- [ ] Style all pages (mobile-first)
- [ ] Add loading states
- [ ] Test paywall integrity
- [ ] Test full payment flow
- [ ] Add favicon and meta tags

### Phase 4: Deployment
- [ ] Deploy to Vercel
- [ ] Configure custom domain
- [ ] Set production environment variables
- [ ] Configure Stripe production webhook
- [ ] Test in production

---

## Future Considerations

These features are explicitly **deferred** (not in initial launch):

- Email notifications for new briefs
- RSS feed (title + free section only)
- Analytics (privacy-focused)
- Sitemap generation
- Account deletion flow
- Subscription pause/resume

**Decision Making**: Any future feature must pass the test: "Does this reduce noise or add to it?"

---

## Contact

- **Production Site**: https://slowbrief.com
- **Repository**: https://github.com/ahipster/slow-brief
- **Support**: [Define support email]

---
