# Slow Brief - Setup & Deployment Guide

This guide walks through setting up Firebase, Stripe, and deploying Slow Brief to production.

## Prerequisites

- [x] Firebase CLI installed and authenticated (✓ logged in as nekrosius.augustas@gmail.com)
- [ ] Firebase project created with billing enabled
- [ ] Stripe account with test/production keys
- [ ] Domain registered (slowbrief.com)

## Step 1: Create Firebase Project

### Option A: Create via Firebase Console (Recommended)
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Project name: **slow-brief**
4. Enable Google Analytics (optional)
5. **IMPORTANT**: Upgrade to Blaze plan (pay-as-you-go) for:
   - Firebase App Hosting
   - Cloud Functions
   - Firestore

### Option B: Create via CLI
```bash
# This will open browser to create project
firebase projects:create slow-brief
```

## Step 2: Initialize Firebase in Project

```bash
# Run from project root
firebase init

# Select:
# - Firestore (database rules)
# - Hosting (Firebase App Hosting)

# When prompted:
# - Use an existing project: slow-brief
# - Firestore rules file: firestore.rules (already exists)
# - Firestore indexes: firestore.indexes.json (create empty)
# - Hosting public directory: .next (for Next.js build)
# - Single-page app: No
# - Set up automatic builds: No (we'll do this manually)
```

## Step 3: Enable Required Services

### In Firebase Console:

1. **Authentication**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" provider
   - Enable "Email link (passwordless sign-in)"

2. **Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Choose region (e.g., us-central1)

3. **Firebase App Hosting**
   - Go to Hosting
   - Set up Firebase App Hosting for Next.js

## Step 4: Get Firebase Configuration

### Get Client Config (for .env.local):
1. Go to Project Settings → General
2. Scroll to "Your apps"
3. Click "Add app" → Web (</>) icon
4. Register app: "Slow Brief Web"
5. Copy the firebaseConfig object values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=<from config>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<from config>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=slow-brief
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<from config>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<from config>
NEXT_PUBLIC_FIREBASE_APP_ID=<from config>
```

### Get Admin SDK Config (for .env.local):
1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Download JSON file
4. Extract values:

```bash
FIREBASE_PROJECT_ID=<from JSON: project_id>
FIREBASE_CLIENT_EMAIL=<from JSON: client_email>
FIREBASE_PRIVATE_KEY="<from JSON: private_key>"
```

**Note**: The private key should be the full key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

## Step 5: Set Up Stripe

### Create Products and Prices:
1. Go to https://dashboard.stripe.com/
2. Products → Add product:
   - **Product 1**: Slow Brief Monthly
     - Price: €5.00 EUR / month
     - Billing period: Monthly
     - Copy the Price ID: `price_xxxxx`

   - **Product 2**: Slow Brief Annual
     - Price: €50.00 EUR / year
     - Billing period: Yearly
     - Copy the Price ID: `price_xxxxx`

### Get Stripe Keys:
```bash
# From Stripe Dashboard → Developers → API keys
STRIPE_SECRET_KEY=sk_test_xxxxx  # (or sk_live_xxxxx for production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx  # (or pk_live_xxxxx)

# Price IDs from above
STRIPE_MONTHLY_PRICE_ID=price_xxxxx
STRIPE_ANNUAL_PRICE_ID=price_xxxxx
```

## Step 6: Configure Environment Variables

### Local Development (.env.local):
Copy all values from Steps 4 and 5 into `.env.local`:

```bash
# Copy from .env.example
cp .env.example .env.local

# Edit .env.local with your actual values
nano .env.local
```

### Production (Firebase Environment):
```bash
# Set environment variables in Firebase
firebase functions:config:set \
  stripe.secret_key="sk_live_xxxxx" \
  stripe.webhook_secret="whsec_xxxxx" \
  firebase.project_id="slow-brief"

# Or set via Firebase Console → Functions → Configuration
```

## Step 7: Deploy Firestore Security Rules

```bash
# Deploy rules (CRITICAL for paywall security)
firebase deploy --only firestore:rules

# Verify rules are deployed:
# Go to Firestore → Rules in Firebase Console
```

## Step 8: Set Up Stripe Webhook

### Get Webhook Endpoint URL:
After deploying (Step 9), your webhook URL will be:
```
https://slowbrief.com/api/webhook/stripe
```

### Configure in Stripe:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://slowbrief.com/api/webhook/stripe`
4. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_`)
7. Add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

## Step 9: Test Locally

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Test Checklist:
- [ ] Homepage loads without errors
- [ ] Navigation works (About, Manifesto, Subscribe, Archive)
- [ ] Subscribe page shows pricing
- [ ] Brief pages show paywall for non-subscribers

## Step 10: Create Test Data in Firestore

To test the paywall, you need at least one brief in Firestore:

### Via Firebase Console:
1. Go to Firestore Database
2. Create collection: `briefs`
3. Add document with auto-ID:
   ```javascript
   {
     slug: "test-brief",
     headline: "This is a test brief",
     freeHtml: "<p>This is the free section. Everyone can see this.</p>",
     paidHtml: "<p>This is the paid section. Only subscribers can see this.</p>",
     publishDate: <Timestamp: today's date>,
     status: "published"
   }
   ```

### Via Script (optional):
Create `scripts/seed-data.ts` if you need to add multiple briefs.

## Step 11: Deploy to Firebase App Hosting

```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy

# Or deploy only hosting:
firebase deploy --only hosting
```

## Step 12: Configure Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter: `slowbrief.com`
4. Follow instructions to:
   - Add DNS A records
   - Verify domain ownership
   - Wait for SSL certificate provisioning (can take 24 hours)

## Step 13: Test Production Deployment

### Paywall Integrity Test:
1. Open Chrome DevTools → Network tab
2. Navigate to a brief page (not logged in)
3. Check Firestore requests
4. **Verify**: `paidHtml` field is NOT present in response
5. Subscribe with test Stripe card: `4242 4242 4242 4242`
6. After subscribing, verify `paidHtml` is now visible

### Authentication Test:
1. Try to subscribe (triggers magic link email)
2. Check email for magic link
3. Click link to authenticate
4. Verify redirect back to site

### Stripe Webhook Test:
1. Go to Stripe Dashboard → Webhooks
2. Find your webhook endpoint
3. Click "Send test webhook"
4. Select event: `customer.subscription.updated`
5. Check Firebase logs to verify webhook was received
6. Check Firestore `users` collection for updated subscription status

## Troubleshooting

### Build Errors:
- Ensure all environment variables are set
- Check Firebase credentials are valid
- Run `npm run build` to see detailed errors

### Paywall Not Working:
- Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Check `lib/briefs.ts` is using Firebase Admin SDK (server-side)
- Ensure pages use `export const dynamic = 'force-dynamic'`

### Stripe Webhook Not Receiving Events:
- Verify webhook URL is accessible (not localhost)
- Check Stripe webhook signing secret is correct
- View webhook logs in Stripe Dashboard
- Check Next.js API route logs

### Firebase Admin SDK Errors:
- Verify service account credentials are correct
- Ensure private key includes BEGIN/END markers
- Check Firebase project has Firestore enabled

## Production Checklist

Before going live:
- [ ] Switch Stripe keys from test to live mode
- [ ] Update Stripe webhook to use production URL
- [ ] Set Firebase environment to production
- [ ] Configure domain SSL certificate
- [ ] Test all flows with real payment
- [ ] Set up monitoring and error tracking
- [ ] Configure email templates for magic links
- [ ] Test on mobile devices
- [ ] Verify SEO meta tags
- [ ] Submit sitemap to Google Search Console

## Maintenance

### Adding New Briefs:
Use Firebase Console → Firestore → briefs collection:
- Write brief as HTML
- Set publishDate to future date
- Set status to 'published'
- Brief will appear automatically on publish date

### Monitoring:
- Firebase Console → Analytics
- Stripe Dashboard → Payments
- Check error logs regularly

## Support

For issues:
- Firebase: https://firebase.google.com/support
- Stripe: https://support.stripe.com/
- Next.js: https://nextjs.org/docs

---

**Remember**: Scarcity is the product. One brief per day. Always.
