# Slow Brief - Quick Start Guide

## 🚀 Get Up and Running in 15 Minutes

### What You'll Need
- Firebase account (with billing enabled)
- Stripe account (test mode is fine)
- 15 minutes

---

## Step 1: Create Firebase Project (3 mins)

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name: `slow-brief`
4. Enable Google Analytics (optional)
5. Click "Create project"
6. **Upgrade to Blaze plan** (required for App Hosting)
   - Go to ⚙️ → Usage and billing → Modify plan
   - Select Blaze (pay-as-you-go)
   - Add billing info

---

## Step 2: Enable Firebase Services (5 mins)

### 2.1 Enable Authentication
1. Left sidebar → **Authentication**
2. Click "Get started"
3. Sign-in method tab → Enable "Email/Password"
4. Enable "Email link (passwordless sign-in)"

### 2.2 Create Firestore Database
1. Left sidebar → **Firestore Database**
2. Click "Create database"
3. Select **Production mode**
4. Choose region: **us-central1** (or closest to you)
5. Click "Enable"

### 2.3 Get Firebase Web Config
1. Project Overview → ⚙️ Settings
2. Scroll to "Your apps" → Click Web icon (</>)
3. App nickname: `Slow Brief Web`
4. Don't check "Firebase Hosting"
5. Click "Register app"
6. **Copy the config object** (you'll need this soon)

### 2.4 Get Admin SDK Credentials
1. Project Settings → **Service accounts** tab
2. Click "Generate new private key"
3. Click "Generate key"
4. **Save the JSON file** (you'll need this)

---

## Step 3: Configure Local Environment (2 mins)

In your project directory:

```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Edit .env.local
nano .env.local
```

Fill in values from Step 2:

```bash
# From Firebase Web Config (Step 2.3):
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=slow-brief.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=slow-brief
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=slow-brief.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...

# From Admin SDK JSON (Step 2.4):
FIREBASE_PROJECT_ID=slow-brief
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@slow-brief.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stripe (use test keys for now):
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (leave as placeholder for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_MONTHLY_PRICE_ID=price_... (we'll create this next)
STRIPE_ANNUAL_PRICE_ID=price_... (we'll create this next)
```

---

## Step 4: Set Up Stripe Products (3 mins)

1. Go to https://dashboard.stripe.com/test/products
2. Click "Add product"

**Product 1: Monthly Subscription**
- Name: `Slow Brief Monthly`
- Description: `Monthly subscription to Slow Brief`
- Pricing: `€5.00 EUR` / `month` / `Recurring`
- Click "Save product"
- **Copy the Price ID** (starts with `price_`)
- Add to `.env.local` as `STRIPE_MONTHLY_PRICE_ID`

**Product 2: Annual Subscription**
- Name: `Slow Brief Annual`
- Description: `Annual subscription to Slow Brief`
- Pricing: `€50.00 EUR` / `year` / `Recurring`
- Click "Save product"
- **Copy the Price ID** (starts with `price_`)
- Add to `.env.local` as `STRIPE_ANNUAL_PRICE_ID`

**Get Stripe Keys:**
- Go to Developers → API keys
- Copy "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Copy "Secret key" (click "Reveal") → `STRIPE_SECRET_KEY`

---

## Step 5: Initialize Firebase Locally (2 mins)

```bash
# Initialize Firebase
firebase init

# When prompted:
# ? Which Firebase features?
#   ◉ Firestore
#   ◉ Hosting
#   (Space to select, Enter to confirm)

# ? Use an existing project? Yes
# ? Select a project: slow-brief

# ? Firestore rules file? firestore.rules (already exists - press Enter)
# ? Firestore indexes file? firestore.indexes.json (press Enter to create)

# ? Hosting public directory? .next (important!)
# ? Configure as single-page app? No
# ? Set up automatic builds? No
# ? File .next/index.html already exists. Overwrite? No
```

---

## Step 6: Deploy Firestore Rules (1 min)

```bash
# Deploy security rules (CRITICAL for paywall!)
firebase deploy --only firestore:rules

# You should see:
# ✔ Deploy complete!
```

---

## Step 7: Create Test Data (2 mins)

Create a test brief in Firestore:

1. Go to Firebase Console → **Firestore Database**
2. Click "Start collection"
3. Collection ID: `briefs`
4. Click "Next"
5. Document ID: (auto-generate)
6. Add fields:

```
Field           Type        Value
-------         ------      -----
slug            string      test-brief
headline        string      Testing the Slow Brief Paywall
freeHtml        string      <p>This is the free section. Everyone can read this part.</p>
paidHtml        string      <p>This is the paid section. Only subscribers see this content.</p><p><strong>What to ignore today:</strong> Everything else.</p>
publishDate     timestamp   (today's date)
status          string      published
```

7. Click "Save"

---

## Step 8: Run Locally & Test! (5 mins)

```bash
# Start development server
npm run dev
```

Open http://localhost:3000

### Quick Tests:

1. **Homepage loads** ✓
2. **Navigate to Archive** → Should show "test-brief"
3. **Click on test brief** → Should show:
   - ✓ Free section visible
   - ✓ Paywall message: "The rest of today's brief is for subscribers"
   - ✓ Subscribe button

4. **Test Paywall Integrity** (CRITICAL):
   - Open Chrome DevTools → Network tab
   - Reload brief page
   - Find Firestore request to `firestore.googleapis.com`
   - Check response → **Verify `paidHtml` field is NOT present**
   - ✓ If missing: Paywall is secure!
   - ✗ If present: Security issue!

5. **Test Subscribe Flow**:
   - Click "Subscribe"
   - Should show pricing: €5/month, €50/year
   - Click "Subscribe Monthly" or "Subscribe Annually"
   - Should redirect to Stripe Checkout (test mode)
   - Use test card: `4242 4242 4242 4242`, any future date, any CVC
   - Complete checkout
   - (Webhook won't work yet - that's Step 9)

---

## Step 9: Deploy to Production (Optional - 5 mins)

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Get your URL:
# ✔  Deploy complete!
# Hosting URL: https://slow-brief.web.app
```

Visit your live site!

---

## Step 10: Set Up Stripe Webhook (After Deploy)

Only needed after deploying to production:

1. Go to Stripe Dashboard → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://slow-brief.web.app/api/webhook/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
5. Click "Add endpoint"
6. Copy "Signing secret" (whsec_...)
7. Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`
8. Redeploy: `npm run build && firebase deploy --only hosting`

---

## ✅ You're Done!

You now have:
- ✓ Secure server-side paywall
- ✓ Stripe subscription payments
- ✓ All 6 pages working
- ✓ Mobile-responsive design
- ✓ SEO basics configured

### Next Steps:
1. Create your first real brief
2. Test on mobile devices
3. Set up custom domain (slowbrief.com)
4. Switch Stripe to live mode when ready
5. Start publishing daily briefs!

---

## Need Help?

Check `SETUP.md` for detailed troubleshooting guide.

**Remember**: One brief per day. Scarcity is the product.
