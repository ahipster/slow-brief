# Slow Brief - Continuous Deployment Guide

This guide covers deploying updates after initial setup is complete.

---

## Prerequisites

- Initial setup completed (see SETUP.md)
- Vercel CLI installed: `npm i -g vercel`
- Git repository configured

---

## Standard Deployment

### 1. Make Changes

Edit code locally, test with:
```bash
npm run dev
```

### 2. Commit Changes

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### 3. Deploy to Production

**Option A: Automatic (via Git)**

Vercel automatically deploys when you push to `main` branch.

**Option B: Manual (via CLI)**

```bash
vercel --prod
```

---

## Deployment Scenarios

### Update Environment Variables

1. Vercel Dashboard → slow-brief → Settings → Environment Variables
2. Edit or add variable
3. Select "Production" environment
4. Save
5. Redeploy: `vercel --prod`

### Update Firestore Rules

```bash
firebase deploy --only firestore:rules
```

No Vercel deployment needed.

### Update Stripe Products/Pricing

1. Create new price in Stripe Dashboard
2. Copy new price ID
3. Update environment variable in Vercel:
   - `STRIPE_MONTHLY_PRICE_ID` or `STRIPE_ANNUAL_PRICE_ID`
4. Redeploy: `vercel --prod`

### Add New Brief

1. Go to Firebase Console → Firestore Database
2. Add document to `briefs` collection:
   ```javascript
   {
     slug: "url-friendly-slug",
     headline: "Brief Headline",
     freeHtml: "<p>Free content (120-180 words)...</p>",
     paidHtml: "<p>Paid content...</p>",
     publishDate: Timestamp (set to desired date/time),
     status: "published"
   }
   ```
3. Brief appears automatically at publish time
4. No deployment needed

### Rollback Deployment

1. Vercel Dashboard → slow-brief → Deployments
2. Find previous working deployment
3. Click three dots → "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

---

## Monitoring

### Check Deployment Status

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- View: Deployments, logs, analytics

**Stripe:**
- Webhooks: https://dashboard.stripe.com/webhooks
- Check event logs for webhook deliveries

**Firebase:**
- Firestore: https://console.firebase.google.com/project/slow-brief/firestore
- Auth: https://console.firebase.google.com/project/slow-brief/authentication

### View Logs

**Vercel Deployment Logs:**
```bash
vercel logs
```

Or: Vercel Dashboard → slow-brief → Deployments → Click deployment → View logs

**Stripe Webhook Logs:**
Stripe Dashboard → Developers → Webhooks → Click endpoint → Events

---

## Troubleshooting

### Build Fails

1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test build locally: `npm run build`
4. Check for TypeScript errors

### Webhook Not Working

1. Stripe Dashboard → Webhooks → Check event logs
2. Verify webhook URL: `https://slowbrief.com/api/webhook/stripe`
3. Verify webhook secret matches Vercel environment variable
4. Check Vercel function logs for errors

### Content Not Updating

1. Check `publishDate` is in the past
2. Check `status` is set to `"published"`
3. Clear browser cache
4. Check Firestore rules allow read access

---

## Common Tasks

### Test Payment Flow

1. Use Stripe test card: `4242 4242 4242 4242`
2. Use test mode keys (starts with `pk_test_` and `sk_test_`)
3. Configure test webhook in Stripe Dashboard
4. Set test keys in Vercel environment variables (Preview environment)

### Preview Deployment

Deploy to preview URL (not production):
```bash
vercel
```

Get shareable preview URL for testing changes.

### Update Custom Domain

1. Vercel Dashboard → slow-brief → Settings → Domains
2. Add or remove domains
3. Update DNS records at registrar if needed

---

## Best Practices

- **Always test locally** before deploying: `npm run dev`
- **Use preview deployments** for testing major changes
- **Monitor webhooks** after deployment for first few minutes
- **Keep environment variables in sync** between local and production
- **Don't commit `.env.local`** to git
- **Document changes** in git commit messages

---

## Quick Reference

```bash
# Development
npm run dev          # Start local server
npm run build        # Build for production
npm run start        # Run production build locally

# Deployment
vercel               # Deploy to preview
vercel --prod        # Deploy to production
vercel rollback      # Rollback to previous deployment

# Firebase
firebase deploy --only firestore:rules    # Deploy Firestore rules

# Logs
vercel logs          # View deployment logs

# Git
git add .
git commit -m "Message"
git push origin main  # Triggers automatic deployment
```

---

**Need first-time setup? See SETUP.md**
**Need technical details? See SPEC.md**
