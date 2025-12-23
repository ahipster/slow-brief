# Quick Deployment Guide

## Prerequisites
Your production Stripe keys:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Qfzg3JaSaBbBvGJ9uPtT4HppCVKPl1TQu4wx2NMGhWy4Kz7DvFgJ89O6Oqsa61gIgiAgUrQW97qDWq2zdC05sZ300MMV2ycoP
STRIPE_SECRET_KEY=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
STRIPE_MONTHLY_PRICE_ID=price_1ShHpgJaSaBbBvGJQXlMpyWl
STRIPE_ANNUAL_PRICE_ID=price_1ShHqHJaSaBbBvGJxe2iEOza
```

---

## 5-Step Deployment

### 1. Push to GitHub
```bash
git push origin claude/claude-md-mjh4ytjl39w25qmu-2rEXT
```

### 2. Firebase Console Setup
1. Open: https://console.firebase.google.com/project/slow-brief/hosting
2. Click "App Hosting" tab → "Get Started"
3. Connect GitHub → Select repo: **ahipster/slow-brief**
4. Select branch: **claude/claude-md-mjh4ytjl39w25qmu-2rEXT**

### 3. Add Environment Variables
In the setup wizard, add these variables:

**Firebase (copy from .env.local):**
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (the full key with -----BEGIN/END-----)

**Stripe (production keys above):**
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_MONTHLY_PRICE_ID
- STRIPE_ANNUAL_PRICE_ID
- STRIPE_WEBHOOK_SECRET (leave empty for now)

### 4. Deploy
- Click "Create" - Firebase will build and deploy automatically
- Wait 5-10 minutes for deployment
- Note your URL: `https://slow-brief-<hash>.web.app`

### 5. Configure Stripe Webhook
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://YOUR-PRODUCTION-URL.web.app/api/webhook/stripe`
4. Events: `checkout.session.completed`, `customer.subscription.*`
5. Copy the webhook secret (whsec_...)
6. Add to Firebase: Settings → Environment Variables → STRIPE_WEBHOOK_SECRET
7. Redeploy

---

## Test Checklist
- [ ] Visit production URL
- [ ] Login works
- [ ] Subscribe page loads
- [ ] Test payment (use test mode first!)
- [ ] Verify webhook in Stripe dashboard
- [ ] Check subscription gives access to content

---

**Full guide:** See `DEPLOY-FIREBASE-MANUAL.md`
