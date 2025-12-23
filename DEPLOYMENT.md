# Slow Brief - Production Deployment Guide

## Prerequisites

- [x] Firebase project created: `slow-brief`
- [x] Firebase CLI installed (`firebase --version`)
- [x] Firestore rules deployed ✅
- [x] Production build successful ✅
- [ ] Domain configured (slowbrief.com)
- [ ] Production Stripe webhook configured

---

## Option 1: Firebase App Hosting (Recommended)

Firebase App Hosting is designed for Next.js SSR apps.

### Step 1: Enable App Hosting

```bash
# Initialize App Hosting
firebase init apphosting
```

Follow prompts:
- Select: Create a new app
- Name: `slow-brief-web`
- Region: Choose closest to your users (e.g., `us-central1` or `europe-west1`)
- Root directory: `.` (current directory)

### Step 2: Configure Environment Variables

```bash
# Set production environment variables
firebase apphosting:secrets:set FIREBASE_PROJECT_ID --data-file <(echo "slow-brief")
firebase apphosting:secrets:set FIREBASE_CLIENT_EMAIL --data-file <(echo "your-client-email")
firebase apphosting:secrets:set FIREBASE_PRIVATE_KEY --data-file <(echo "your-private-key")
firebase apphosting:secrets:set STRIPE_SECRET_KEY --data-file <(echo "sk_live_...")
firebase apphosting:secrets:set STRIPE_WEBHOOK_SECRET --data-file <(echo "whsec_...")
firebase apphosting:secrets:set STRIPE_MONTHLY_PRICE_ID --data-file <(echo "price_...")
firebase apphosting:secrets:set STRIPE_ANNUAL_PRICE_ID --data-file <(echo "price_...")
```

### Step 3: Deploy

```bash
# Deploy to App Hosting
firebase deploy --only apphosting
```

---

## Option 2: Vercel (Alternative - Fast & Easy)

If Firebase App Hosting setup is complex, Vercel is optimized for Next.js:

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Deploy

```bash
vercel --prod
```

### Step 3: Set Environment Variables

In Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add all variables from `.env.local`
- Redeploy after adding

---

## Post-Deployment Tasks

### 1. Configure Production Stripe Webhook

```bash
# In Stripe Dashboard:
# 1. Go to Developers → Webhooks
# 2. Add endpoint: https://slowbrief.com/api/webhook/stripe
# 3. Select events:
#    - checkout.session.completed
#    - customer.subscription.created
#    - customer.subscription.updated
#    - customer.subscription.deleted
# 4. Copy webhook signing secret
# 5. Update production env: STRIPE_WEBHOOK_SECRET=whsec_prod_...
```

### 2. Set Up Custom Domain

#### Firebase:
```bash
firebase hosting:channel:deploy production --site slowbrief-com
```

Then add custom domain in Firebase Console:
- Hosting → Add custom domain
- Enter: slowbrief.com
- Follow DNS configuration steps

#### Vercel:
- Go to Project Settings → Domains
- Add: slowbrief.com
- Configure DNS records as shown

### 3. Test Production

- [ ] Visit: https://slowbrief.com
- [ ] Test login flow
- [ ] Test subscription checkout
- [ ] Verify paywall works
- [ ] Check webhook logs in Stripe Dashboard

### 4. Create Production Brief

```bash
# Use Firebase Console or run:
node scripts/create-production-brief.js
```

---

## Monitoring

### Firebase Console
- **Hosting**: https://console.firebase.google.com/project/slow-brief/hosting
- **Firestore**: https://console.firebase.google.com/project/slow-brief/firestore
- **Functions**: https://console.firebase.google.com/project/slow-brief/functions

### Stripe Dashboard
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **Subscriptions**: https://dashboard.stripe.com/subscriptions
- **Customers**: https://dashboard.stripe.com/customers

---

## Rollback Plan

If something goes wrong:

```bash
# Rollback to previous deployment
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

Or in Vercel:
- Go to Deployments
- Find previous working deployment
- Click "Promote to Production"

---

## Environment Variables Checklist

Production `.env` should have:

```bash
# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=slow-brief.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=slow-brief
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase (Server)
FIREBASE_PROJECT_ID=slow-brief
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Stripe (PRODUCTION KEYS!)
STRIPE_SECRET_KEY=sk_live_...  # NOT sk_test_!
STRIPE_WEBHOOK_SECRET=whsec_... # Production webhook secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... # NOT pk_test_!
STRIPE_MONTHLY_PRICE_ID=price_... # Production price ID
STRIPE_ANNUAL_PRICE_ID=price_... # Production price ID
```

**⚠️ CRITICAL**: Use **LIVE** Stripe keys in production, not test keys!

---

## Security Checklist

- [ ] Firestore rules deployed and tested
- [ ] Environment variables not committed to git (.env.local in .gitignore)
- [ ] Stripe webhook signature verification enabled
- [ ] HTTPS enforced (automatic with Firebase/Vercel)
- [ ] Session cookies HttpOnly and Secure flags set
- [ ] Firebase Admin SDK credentials secured

---

## DNS Configuration (for slowbrief.com)

### If using Firebase:
```
A     @    199.36.158.100
CNAME www  slow-brief.web.app
```

### If using Vercel:
```
A     @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

---

## Next Steps After Deployment

1. **Test everything thoroughly**
2. **Monitor webhook events** in Stripe Dashboard
3. **Check Firebase logs** for errors
4. **Create first real brief** to publish
5. **Announce launch!**

🎉 **Your Slow Brief platform is ready for production!**
