# Slow Brief - First-Time Setup Guide

This guide covers the one-time setup required to get Slow Brief running in production.

---

## Prerequisites

- Node.js 20+
- Git
- Firebase account
- Stripe account
- Vercel account
- Domain (slowbrief.com)

---

## 1. Clone Repository

```bash
git clone https://github.com/ahipster/slow-brief.git
cd slow-brief
npm install
```

---

## 2. Firebase Setup

### 2.1 Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Project name: `slow-brief`
4. Enable Google Analytics: Optional
5. Click "Create project"

### 2.2 Enable Authentication

1. In Firebase Console → Authentication
2. Click "Get started"
3. Click "Email/Password" → Enable "Email link (passwordless sign-in)"
4. Add authorized domain: `slowbrief.com` (and `localhost` for development)
5. Save

### 2.3 Create Firestore Database

1. In Firebase Console → Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose location (e.g., `europe-west1` for Europe)
5. Click "Enable"

### 2.4 Deploy Firestore Rules

```bash
firebase login
firebase init

# Select:
# - Firestore
# - Use existing project: slow-brief
# - Accept default firestore.rules
# - Don't overwrite existing files

firebase deploy --only firestore:rules
```

### 2.5 Get Firebase Credentials

**Web App Config:**
1. Firebase Console → Project Settings → General
2. Scroll to "Your apps"
3. Click web icon (</>) → "Add app"
4. App nickname: "Slow Brief Web"
5. Click "Register app"
6. Copy the config values

**Admin SDK:**
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download JSON file
4. Extract values for environment variables

---

## 3. Stripe Setup

### 3.1 Create Stripe Account

1. Go to https://stripe.com
2. Sign up for account
3. Complete business verification

### 3.2 Create Subscription Products

**Monthly Subscription:**
1. Stripe Dashboard → Products → "+ Add product"
2. Name: "Slow Brief Monthly"
3. Description: "Monthly subscription to Slow Brief"
4. Pricing: €5.00 / month (recurring)
5. Save → Copy the Price ID (starts with `price_`)

**Annual Subscription:**
1. Stripe Dashboard → Products → "+ Add product"
2. Name: "Slow Brief Annual"
3. Description: "Annual subscription to Slow Brief"
4. Pricing: €50.00 / year (recurring)
5. Save → Copy the Price ID (starts with `price_`)

### 3.3 Get API Keys

1. Stripe Dashboard → Developers → API keys
2. Copy "Publishable key" (starts with `pk_live_`)
3. Click "Reveal" on "Secret key" (starts with `sk_live_`)
4. Save both keys securely

---

## 4. Vercel Setup

### 4.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Connect your GitHub account

### 4.2 Initial Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (will prompt for login)
vercel --prod
```

Follow prompts:
- Set up and deploy? → **Y**
- Which scope? → Choose your account
- Link to existing project? → **N**
- Project name? → **slow-brief**
- In which directory? → **./**
- Override settings? → **N**

Save the deployment URL (e.g., `https://slow-brief.vercel.app`)

### 4.3 Add Environment Variables

Go to Vercel Dashboard → slow-brief → Settings → Environment Variables

Add each variable (select "Production" environment):

```bash
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=<from Firebase config>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=slow-brief.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=slow-brief
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<from Firebase config>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<from Firebase config>
NEXT_PUBLIC_FIREBASE_APP_ID=<from Firebase config>

# Firebase Server (Secret)
FIREBASE_PROJECT_ID=slow-brief
FIREBASE_CLIENT_EMAIL=<from service account JSON>
FIREBASE_PRIVATE_KEY="<from service account JSON - include quotes and \n>"

# Stripe Production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_ANNUAL_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=<leave empty for now>

# Base URL
NEXT_PUBLIC_BASE_URL=https://slowbrief.com
```

Redeploy: `vercel --prod`

---

## 5. Configure Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks → "+ Add endpoint"
2. Endpoint URL: `https://slowbrief.com/api/webhook/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Click "Add endpoint"
5. Copy webhook secret (starts with `whsec_`)
6. Add to Vercel: Settings → Environment Variables → `STRIPE_WEBHOOK_SECRET`
7. Redeploy: `vercel --prod`

---

## 6. Custom Domain Setup

1. Vercel Dashboard → slow-brief → Settings → Domains → Add: `slowbrief.com`
2. Configure DNS at domain registrar:
   ```
   A     @    76.76.21.21
   CNAME www  cname.vercel-dns.com
   ```
3. Wait for DNS propagation (10 min - 48 hours)
4. Vercel auto-provisions SSL certificate

---

## 7. Production Testing

Test checklist:
- [ ] Visit https://slowbrief.com
- [ ] Login with magic link works
- [ ] Paywall shows for non-subscribers
- [ ] Subscribe → Stripe checkout works
- [ ] Payment processes successfully
- [ ] Webhook updates subscription status
- [ ] Full content visible after subscription
- [ ] Account page accessible
- [ ] Stripe Customer Portal works

---

**Setup complete! Your Slow Brief platform is now live.** 🎉
